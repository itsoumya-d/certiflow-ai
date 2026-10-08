/** @jest-environment node */

import path from 'path'
import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { analyzeDocument } from '@/lib/gemini'
import fs from 'fs'
import { POST, GET, DELETE } from '@/app/api/evidence/route'

jest.mock('next-auth/next', () => ({ getServerSession: jest.fn() }))
jest.mock('@/app/api/auth/[...nextauth]/route', () => ({ authOptions: {} }))
jest.mock('@/lib/gemini', () => ({ analyzeDocument: jest.fn() }))
jest.mock('fs', () => ({
    ...jest.requireActual('fs'),
    existsSync: jest.fn(),
    readFileSync: jest.fn(),
    writeFileSync: jest.fn(),
    renameSync: jest.fn(),
    unlinkSync: jest.fn(),
}))

const DB_PATH = path.join(process.cwd(), 'evidence.json')
const files = new Map<string, string>()
const session = jest.mocked(getServerSession)
const analyze = jest.mocked(analyzeDocument)
const read = jest.mocked(fs.readFileSync)
const write = jest.mocked(fs.writeFileSync)
const rename = jest.mocked(fs.renameSync)
const unlink = jest.mocked(fs.unlinkSync)
const storedEvidence = {
    id: 'ev-existing', name: 'Existing evidence', description: '', framework: 'SOC 2',
    controlId: 'CC1', type: 'document', mimeType: 'text/plain', size: 4,
    uploadedBy: 'fixture@example.test', uploadedAt: '2026-01-01T00:00:00.000Z', status: 'verified',
}
const originalBytes = JSON.stringify([[storedEvidence.id, storedEvidence]], null, 2)
const analysis = { controls: [{ id: 'CC1', name: 'Fixture control', status: 'compliant' as const, evidence: 'Fixture' }], riskLevel: 'low' as const, summary: 'Synthetic analysis' }
const diskError = (code: string) => Object.assign(new Error(`Synthetic ${code}`), { code })
const request = (id?: string) => new NextRequest(`http://localhost/api/evidence${id ? `?id=${id}` : ''}`)
function uploadRequest(overrides: Record<string, string | File> = {}) {
    const form = new FormData()
    form.set('file', new File(['Synthetic evidence'], 'fixture.txt', { type: 'text/plain' }))
    form.set('name', 'New evidence')
    form.set('framework', 'SOC 2')
    for (const [key, value] of Object.entries(overrides)) form.set(key, value)
    return new NextRequest('http://localhost/api/evidence', { method: 'POST', body: form })
}
// Drain the route's fire-and-forget analysis, including its dynamic import.
const settleAnalysis = () => new Promise<void>(resolve => setImmediate(resolve))

beforeEach(() => {
    jest.clearAllMocks()
    files.clear()
    session.mockResolvedValue({ user: { email: 'fixture@example.test', role: 'admin' }, expires: '' })
    analyze.mockResolvedValue(analysis)
    jest.mocked(fs.existsSync).mockImplementation(p => files.has(String(p)))
    read.mockImplementation(p => {
        const contents = files.get(String(p))
        if (contents === undefined) throw diskError('ENOENT')
        return contents
    })
    write.mockImplementation((p, data) => { files.set(String(p), String(data)) })
    rename.mockImplementation((from, to) => {
        const contents = files.get(String(from))
        if (contents === undefined) throw diskError('ENOENT')
        files.set(String(to), contents)
        files.delete(String(from))
    })
    unlink.mockImplementation(p => { files.delete(String(p)) })
    jest.spyOn(console, 'error').mockImplementation(() => {})
})
afterEach(async () => {
    await settleAnalysis()
    jest.restoreAllMocks()
})

describe('actual evidence route persistence', () => {
    it('treats only an absent file as an empty store', async () => {
        const response = await GET(request())
        expect(response.status).toBe(200)
        expect(await response.json()).toEqual({ evidence: [], total: 0 })
        expect(write).not.toHaveBeenCalled()
    })

    it.each(['{broken', 'null', '{}', '[null]', '[["broken",null]]', '[["broken",{}]]', JSON.stringify([[storedEvidence.id, storedEvidence], [storedEvidence.id, storedEvidence]]), JSON.stringify([[storedEvidence.id, { ...storedEvidence, size: '4' }]])])('refuses malformed existing data %s without replacing it', async contents => {
        files.set(DB_PATH, contents)
        expect((await GET(request())).status).toBe(500)
        expect((await POST(uploadRequest())).status).toBe(500)
        expect((await DELETE(request(storedEvidence.id))).status).toBe(500)
        expect(write).not.toHaveBeenCalled()
        expect(files.get(DB_PATH)).toBe(contents)
        expect(analyze).not.toHaveBeenCalled()
    })

    it('propagates read failures without writing or starting analysis', async () => {
        files.set(DB_PATH, originalBytes)
        read.mockImplementation(() => { throw diskError('EACCES') })
        expect((await GET(request())).status).toBe(500)
        expect((await POST(uploadRequest())).status).toBe(500)
        expect((await DELETE(request(storedEvidence.id))).status).toBe(500)
        expect(write).not.toHaveBeenCalled()
        expect(analyze).not.toHaveBeenCalled()
        expect(files.get(DB_PATH)).toBe(originalBytes)
    })

    it.each(['write', 'rename'])('returns upload failure on %s failure and preserves prior bytes for retry', async failure => {
        files.set(DB_PATH, originalBytes)
        if (failure === 'write') {
            write.mockImplementationOnce((p) => {
                files.set(String(p), 'partial bytes')
                throw diskError('ENOSPC')
            })
        } else rename.mockImplementationOnce(() => { throw diskError('EACCES') })
        const failed = await POST(uploadRequest())
        expect(failed.status).toBe(500)
        expect(await failed.json()).toEqual({ error: 'Failed to upload evidence' })
        expect(files.get(DB_PATH)).toBe(originalBytes)
        expect([...files.keys()]).toEqual([DB_PATH])
        expect(analyze).not.toHaveBeenCalled()
        const retry = await POST(uploadRequest())
        expect(retry.status).toBe(200)
        const created = (await retry.json()).evidence
        await settleAnalysis()
        const fresh = await GET(request(created.id))
        expect(fresh.status).toBe(200)
        expect((await fresh.json()).evidence).toMatchObject({ id: created.id, status: 'verified' })
        expect((await (await GET(request())).json()).total).toBe(2)
    })

    it.each(['write', 'rename'])('reports delete failure on %s failure and leaves evidence readable', async failure => {
        files.set(DB_PATH, originalBytes)
        if (failure === 'write') write.mockImplementationOnce(() => { throw diskError('ENOSPC') })
        else rename.mockImplementationOnce(() => { throw diskError('EACCES') })
        const response = await DELETE(request(storedEvidence.id))
        expect(response.status).toBe(500)
        expect(await response.json()).toEqual({ error: 'Failed to delete evidence' })
        expect(files.get(DB_PATH)).toBe(originalBytes)
        expect([...files.keys()]).toEqual([DB_PATH])
        expect((await GET(request(storedEvidence.id))).status).toBe(200)
    })

    it('creates, analyzes, reads, filters, deletes, and confirms absence', async () => {
        const response = await POST(uploadRequest())
        expect(response.status).toBe(200)
        const body = await response.json()
        expect(body.success).toBe(true)
        await settleAnalysis()
        expect(analyze).toHaveBeenCalledWith('Synthetic evidence', 'SOC 2')
        const found = await GET(request(body.evidence.id))
        expect((await found.json()).evidence).toMatchObject({ status: 'verified', analysisResult: { summary: 'Synthetic analysis' } })
        expect((await (await GET(new NextRequest('http://localhost/api/evidence?framework=SOC%202&status=verified'))).json()).total).toBe(1)
        expect((await (await DELETE(request(body.evidence.id))).json()).success).toBe(true)
        expect((await GET(request(body.evidence.id))).status).toBe(404)
        expect((await DELETE(request(body.evidence.id))).status).toBe(404)
        expect((await DELETE(request())).status).toBe(400)
    })

    it.each(['name', 'description', 'framework', 'controlId', 'type', 'file'])('rejects malformed multipart %s without poisoning storage', async field => {
        files.set(DB_PATH, originalBytes)
        const invalid = field === 'file' ? 'not a file' : new File(['invalid'], 'field.txt', { type: 'text/plain' })
        const response = await POST(uploadRequest({ [field]: invalid }))
        expect(response.status).toBe(400)
        expect(await response.json()).toEqual({ error: 'Invalid evidence upload fields' })
        expect(write).not.toHaveBeenCalled()
        expect(analyze).not.toHaveBeenCalled()
        expect(files.get(DB_PATH)).toBe(originalBytes)
        expect((await GET(request(storedEvidence.id))).status).toBe(200)
    })

    it('retains 401 and admin-only delete boundaries without accessing storage', async () => {
        session.mockResolvedValue(null)
        expect((await GET(request())).status).toBe(401)
        expect((await POST(uploadRequest())).status).toBe(401)
        expect((await DELETE(request(storedEvidence.id))).status).toBe(401)
        session.mockResolvedValue({ user: { email: 'fixture@example.test', role: 'user' }, expires: '' })
        expect((await DELETE(request(storedEvidence.id))).status).toBe(403)
        expect(read).not.toHaveBeenCalled()
        expect(write).not.toHaveBeenCalled()
    })

    it('does not start analysis or create a store when the initial save fails', async () => {
        write.mockImplementationOnce(() => { throw diskError('ENOSPC') })
        expect((await POST(uploadRequest())).status).toBe(500)
        await settleAnalysis()
        expect(analyze).not.toHaveBeenCalled()
        expect(files.size).toBe(0)
    })

    it('handles an analyzing-status failure before starting the provider', async () => {
        rename.mockImplementation((from, to) => {
            const contents = files.get(String(from))!
            if (contents.includes('"analyzing"')) throw diskError('ENOSPC')
            files.set(String(to), contents)
            files.delete(String(from))
        })
        const response = await POST(uploadRequest())
        expect(response.status).toBe(200) // The initial pending metadata was saved.
        const id = (await response.json()).evidence.id
        await settleAnalysis()
        expect(analyze).not.toHaveBeenCalled()
        expect((await (await GET(request(id))).json()).evidence.status).toBe('failed')
    })

    it('does not expose a verified result when its replacement fails', async () => {
        rename.mockImplementation((from, to) => {
            const contents = files.get(String(from))!
            if (contents.includes('"verified"')) throw diskError('ENOSPC')
            files.set(String(to), contents)
            files.delete(String(from))
        })
        const response = await POST(uploadRequest())
        const id = (await response.json()).evidence.id
        await settleAnalysis()
        const fresh = (await (await GET(request(id))).json()).evidence
        expect(fresh.status).toBe('failed')
        expect(fresh.analysisResult).toBeUndefined()
        expect([...files.keys()]).toEqual([DB_PATH])
    })

    it('handles a failed background read and failed fallback read', async () => {
        analyze.mockImplementationOnce(async () => {
            read.mockImplementation(() => { throw diskError('EACCES') })
            return analysis
        })
        const response = await POST(uploadRequest())
        expect(response.status).toBe(200)
        await settleAnalysis()
        expect(console.error).toHaveBeenCalledWith('Failed to persist analysis failure:', expect.any(Error))
        expect(JSON.parse(files.get(DB_PATH)!)[0][1].status).toBe('analyzing')
        expect([...files.keys()]).toEqual([DB_PATH])
    })

    it('never deletes another temporary file after an exclusive-create collision', async () => {
        files.set(DB_PATH, originalBytes)
        write.mockImplementationOnce((p, _data, options) => {
            expect(options).toEqual({ flag: 'wx', mode: 0o600 })
            files.set(String(p), 'another writer owns this file')
            throw diskError('EEXIST')
        })
        expect((await POST(uploadRequest())).status).toBe(500)
        expect(unlink).not.toHaveBeenCalled()
        expect(files.get(DB_PATH)).toBe(originalBytes)
        expect([...files.values()]).toContain('another writer owns this file')
        expect(analyze).not.toHaveBeenCalled()
    })

    it('cleans up its own completed temporary write if rename reports EEXIST', async () => {
        files.set(DB_PATH, originalBytes)
        rename.mockImplementationOnce(() => { throw diskError('EEXIST') })
        expect((await POST(uploadRequest())).status).toBe(500)
        expect(unlink).toHaveBeenCalledTimes(1)
        expect(files.get(DB_PATH)).toBe(originalBytes)
        expect([...files.keys()]).toEqual([DB_PATH])
    })

    it('preserves the original error when temporary-file cleanup also fails', async () => {
        files.set(DB_PATH, originalBytes)
        rename.mockImplementationOnce(() => { throw diskError('EACCES') })
        unlink.mockImplementationOnce(() => { throw diskError('EPERM') })
        expect((await POST(uploadRequest())).status).toBe(500)
        expect(files.get(DB_PATH)).toBe(originalBytes)
        expect(analyze).not.toHaveBeenCalled()
        expect(console.error).toHaveBeenCalledWith('Failed to clean up evidence temporary file:', expect.objectContaining({ code: 'EPERM' }))
        expect(console.error).toHaveBeenCalledWith('Evidence upload error:', expect.objectContaining({ code: 'EACCES' }))
    })

    it('handles analysis and fallback-status write failures without an unhandled rejection', async () => {
        analyze.mockRejectedValueOnce(new Error('Synthetic provider error'))
        // Initial save and analyzing update succeed; failed-status persistence fails.
        rename.mockImplementation((from, to) => {
            const contents = files.get(String(from))!
            if (contents.includes('"failed"')) throw diskError('ENOSPC')
            files.set(String(to), contents)
            files.delete(String(from))
        })
        const response = await POST(uploadRequest())
        expect(response.status).toBe(200)
        const id = (await response.json()).evidence.id
        await settleAnalysis()
        expect((await (await GET(request(id))).json()).evidence.status).toBe('analyzing')
        expect(console.error).toHaveBeenCalledWith('Failed to persist analysis failure:', expect.any(Error))
        expect([...files.keys()]).toEqual([DB_PATH])
    })
})

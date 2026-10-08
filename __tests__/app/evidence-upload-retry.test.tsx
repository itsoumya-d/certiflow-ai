import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import EvidencePage from '@/app/evidence/page'
import { ToastProvider } from '@/components/Toast'

// The upload screen is real; only unrelated navigation/authentication is isolated.
jest.mock('@/components/Sidebar', () => ({
    __esModule: true,
    default: () => null,
}))

const originalFetch = global.fetch
const mockFetch = jest.fn() as jest.MockedFunction<typeof fetch>

function jsonResponse(status: number, body: unknown): Response {
    return {
        ok: status >= 200 && status < 300,
        status,
        json: async () => body,
    } as Response
}

describe('Evidence upload retry', () => {
    beforeEach(() => {
        jest.useFakeTimers()
        mockFetch.mockReset()
        global.fetch = mockFetch
    })

    afterEach(() => {
        cleanup()
        jest.clearAllTimers()
        jest.useRealTimers()
        global.fetch = originalFetch
    })

    it('preserves the file and every editable field after HTTP 500, then retries and displays persisted evidence', async () => {
        const file = new File(['{"encryption":"enabled"}'], 's3-settings.json', {
            type: 'application/json',
        })
        const evidence = {
            id: 'persisted-evidence-1',
            name: 'Production S3 encryption settings',
            description: 'Saved evidence returned by the server',
            framework: 'ISO 27001',
            controlId: 'A.8.24',
            type: 'configuration',
            status: 'pending',
            uploadedBy: 'reviewer@example.test',
        }
        mockFetch
            .mockResolvedValueOnce(jsonResponse(200, { evidence: [] }))
            .mockResolvedValueOnce(jsonResponse(500, { error: 'Failed to save evidence' }))
            .mockResolvedValueOnce(jsonResponse(201, { evidence }))
            .mockResolvedValueOnce(jsonResponse(200, { evidence: [evidence] }))

        const { container } = render(
            <ToastProvider>
                <EvidencePage />
            </ToastProvider>
        )
        await act(async () => {})
        expect(mockFetch).toHaveBeenCalledTimes(1)
        expect(screen.queryByText(evidence.name)).not.toBeInTheDocument()

        fireEvent.click(screen.getByRole('button', { name: 'Upload Evidence' }))
        // The existing file picker is hidden, and the labels are not associated
        // with controls, so use its input type and the visible field values.
        const fileInput = container.querySelector<HTMLInputElement>('input[type="file"]')!
        const nameInput = screen.getByPlaceholderText('e.g., AWS S3 Encryption Settings')
        const controlInput = screen.getByPlaceholderText('e.g., CC6.1')
        const frameworkSelect = screen.getByDisplayValue('SOC 2')
        const typeSelect = screen.getByDisplayValue('Document')
        fireEvent.change(fileInput, { target: { files: [file] } })
        fireEvent.change(nameInput, { target: { value: evidence.name } })
        fireEvent.change(controlInput, { target: { value: evidence.controlId } })
        fireEvent.change(frameworkSelect, { target: { value: evidence.framework } })
        fireEvent.change(typeSelect, { target: { value: evidence.type } })

        const uploadButton = screen.getAllByRole('button', { name: 'Upload Evidence' })[1]
        await act(async () => {
            fireEvent.click(uploadButton)
        })

        expect(screen.getByText('Upload failed. Please try again.')).toBeVisible()
        expect(mockFetch).toHaveBeenCalledTimes(2)
        expect(screen.queryByRole('heading', { name: 'Upload Successful!' })).not.toBeInTheDocument()
        expect(within(screen.getByRole('table')).queryByText(evidence.name)).not.toBeInTheDocument()

        // A failed upload must not schedule the success path's form reset.
        act(() => {
            jest.advanceTimersByTime(2000)
        })
        expect(screen.getByRole('heading', { name: 'Upload Evidence', level: 3 })).toBeVisible()
        expect(screen.getByText(file.name)).toBeVisible()
        expect(fileInput.files?.[0]).toBe(file)
        expect(nameInput).toBeVisible()
        expect(nameInput).toHaveValue(evidence.name)
        expect(controlInput).toBeVisible()
        expect(controlInput).toHaveValue(evidence.controlId)
        expect(frameworkSelect).toBeVisible()
        expect(frameworkSelect).toHaveValue(evidence.framework)
        expect(typeSelect).toBeVisible()
        expect(typeSelect).toHaveValue(evidence.type)
        expect(uploadButton).toBeEnabled()

        const firstRequest = mockFetch.mock.calls[1]
        expect(firstRequest[0]).toBe('/api/evidence')
        expect(firstRequest[1]?.method).toBe('POST')
        const firstPayload = firstRequest[1]?.body as FormData
        expect(firstPayload.get('file')).toBe(file)
        expect(Object.fromEntries(firstPayload.entries())).toEqual({
            file,
            name: evidence.name,
            // Description is included in the payload but has no editable field.
            description: '',
            framework: evidence.framework,
            controlId: evidence.controlId,
            type: evidence.type,
        })

        // Retry directly, without selecting the file again or editing any field.
        await act(async () => {
            fireEvent.click(uploadButton)
        })
        expect(mockFetch).toHaveBeenCalledTimes(4)
        const retryRequest = mockFetch.mock.calls[2]
        expect(retryRequest[0]).toBe('/api/evidence')
        expect(retryRequest[1]?.method).toBe('POST')
        const retryPayload = retryRequest[1]?.body as FormData
        expect(retryPayload).not.toBe(firstPayload)
        expect(retryPayload.get('file')).toBe(file)
        expect(Array.from(retryPayload.entries())).toEqual(Array.from(firstPayload.entries()))
        expect(mockFetch.mock.calls[3]).toEqual(['/api/evidence'])
        expect(screen.getByRole('heading', { name: 'Upload Successful!' })).toBeVisible()

        const savedRow = within(screen.getByRole('table')).getByRole('row', {
            name: new RegExp(evidence.name),
        })
        expect(within(savedRow).getByText(evidence.description)).toBeVisible()
        expect(within(savedRow).getByText(evidence.framework)).toBeVisible()
        expect(within(savedRow).getByText(evidence.controlId)).toBeVisible()
        expect(within(savedRow).getByText(evidence.uploadedBy)).toBeVisible()
        expect(within(savedRow).getByText('Pending')).toBeVisible()

        act(() => {
            jest.advanceTimersByTime(2000)
        })
        expect(screen.queryByRole('heading', { name: 'Upload Evidence', level: 3 })).not.toBeInTheDocument()
        expect(within(screen.getByRole('table')).getByText(evidence.name)).toBeVisible()
        expect(mockFetch).toHaveBeenCalledTimes(4)
    })
})

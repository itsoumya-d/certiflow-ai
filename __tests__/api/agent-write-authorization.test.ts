/** @jest-environment node */
import {NextRequest} from 'next/server'
import {getServerSession} from 'next-auth/next'
import {computerUseAgent} from '@/lib/agents/computer-use'
import {POST,GET} from '@/app/api/agents/execute/route'
jest.mock('next-auth/next',()=>({getServerSession:jest.fn()}))
jest.mock('@/app/api/auth/[...nextauth]/route',()=>({authOptions:{}}))
jest.mock('@/lib/agents/computer-use',()=>({computerUseAgent:{executeWorkflow:jest.fn()},VERIFICATION_WORKFLOWS:{fixture:[{id:'test'}]}}))
const session=jest.mocked(getServerSession),execute=jest.mocked(computerUseAgent.executeWorkflow)
beforeEach(()=>{jest.clearAllMocks();execute.mockResolvedValue({sessionId:'test',results:[]})})
it.each([null,{user:{role:'auditor'}},{user:{}},{user:{role:'unknown'}}])('denies non-writer without parsing or running workflow %#',async value=>{
 session.mockResolvedValue(value)
 const req=new NextRequest('http://localhost/api/agents/execute',{method:'POST',body:'{"workflow":"fixture"}'})
 const parse=jest.spyOn(req,'json')
 expect((await POST(req)).status).toBe(value===null?401:403)
 expect(parse).not.toHaveBeenCalled();expect(execute).not.toHaveBeenCalled()
})
it.each(['user','admin'])('allows %s workflow execution',async role=>{
 session.mockResolvedValue({user:{role}})
 expect((await POST(new NextRequest('http://localhost/api/agents/execute',{method:'POST',body:'{"workflow":"fixture"}'}))).status).toBe(200)
 expect(execute).toHaveBeenCalledTimes(1)
})
it('preserves authenticated auditor history reads',async()=>{
 session.mockResolvedValue({user:{role:'auditor'}})
 expect((await GET(new NextRequest('http://localhost/api/agents/execute'))).status).toBe(200)
 expect(execute).not.toHaveBeenCalled()
})

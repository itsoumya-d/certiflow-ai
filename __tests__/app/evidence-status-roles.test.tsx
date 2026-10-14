import { cleanup, render, screen, waitFor } from '@testing-library/react'
import { useSession } from 'next-auth/react'
import AuditorDashboard from '@/app/auditor/page'
import EvidencePage from '@/app/evidence/page'
import AgentsPage from '@/app/agents/page'
import { ToastProvider } from '@/components/Toast'
import { evidenceFileKind } from '@/lib/evidence-analysis'
jest.mock('next-auth/react', () => ({useSession: jest.fn()}))
jest.mock('@/components/Sidebar', () => ({__esModule:true,default:()=>null}))
const originalEventSource=global.EventSource
const originalFetch=global.fetch
beforeEach(() => {
 global.EventSource=class { close() {} } as unknown as typeof EventSource
 (useSession as jest.Mock).mockReturnValue({data:{user:{role:'auditor'}},status:'authenticated'})
 global.fetch=jest.fn().mockResolvedValue({ok:true,json:async()=>({evidence:[],agents:[],tasks:[]})})
})
afterEach(()=>{cleanup();global.fetch=originalFetch;global.EventSource=originalEventSource})
it('accepts log files without MIME registration but not executable MIME',()=>{
 expect(evidenceFileKind('audit.log','')).toBe('text')
 expect(evidenceFileKind('audit.log','application/x-msdownload')).toBeNull()
})
it('shows exact analysis states and counts only review-required evidence as pending review',async()=>{
 global.fetch=jest.fn().mockResolvedValue({ok:true,json:async()=>({evidence:['review_required','unprocessed','failed','analyzing','pending'].map((status,i)=>({id:String(i),name:'Record '+i,framework:'SOC2',controlId:'C1',status}))})})
 render(<AuditorDashboard />)
 await waitFor(()=>expect(screen.getByText('Review Required')).toBeInTheDocument())
 expect(screen.getByText('Analysis Unavailable')).toBeInTheDocument()
 expect(screen.getByText('Analysis Failed')).toBeInTheDocument()
 expect(screen.getByText('Analyzing')).toBeInTheDocument()
 expect(screen.getByText('Pending Analysis')).toBeInTheDocument()
 expect(screen.queryByText('Ready for Review')).not.toBeInTheDocument()
 expect(screen.getByText('Pending Review').parentElement?.textContent).toContain('1')
})
it.each(['auditor','user','admin'])('gates evidence upload and workflow controls for %s',async role=>{
 (useSession as jest.Mock).mockReturnValue({data:{user:{role}},status:'authenticated'})
 const first=render(<ToastProvider><EvidencePage /></ToastProvider>)
 await waitFor(()=>expect(global.fetch).toHaveBeenCalled())
 expect(screen.queryByRole('button',{name:'Upload Evidence'}) !== null).toBe(role !== 'auditor')
 first.unmount()
 render(<ToastProvider><AgentsPage /></ToastProvider>)
 expect(screen.queryByText('Quick Verification Workflows') !== null).toBe(role !== 'auditor')
})

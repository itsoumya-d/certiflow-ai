import {
    ComputerUseAgent,
    VERIFICATION_WORKFLOWS,
    NavigationTask,
} from '@/lib/agents/computer-use'

describe('ComputerUseAgent', () => {
    let agent: ComputerUseAgent

    beforeEach(() => {
        agent = new ComputerUseAgent()
    })

    describe('startSession', () => {
        it('should create a new session with unique ID', async () => {
            const sessionId = await agent.startSession()

            expect(sessionId).toBeDefined()
            expect(sessionId).toMatch(/^session_\d+_[a-z0-9]+$/)
        })

        it('should set session status to active', async () => {
            await agent.startSession()
            const session = agent.getSession()

            expect(session).not.toBeNull()
            expect(session?.status).toBe('active')
        })

        it('should initialize empty tasks and results arrays', async () => {
            await agent.startSession()
            const session = agent.getSession()

            expect(session?.tasks).toEqual([])
            expect(session?.results).toEqual([])
        })
    })

    describe('executeTask', () => {
        it('should throw error if no active session', async () => {
            const task: NavigationTask = {
                id: 'test-1',
                type: 'navigate',
                target: 'test-url',
            }

            await expect(agent.executeTask(task)).rejects.toThrow('No active session')
        })

        it('should execute navigate task and return success', async () => {
            await agent.startSession()
            const task: NavigationTask = {
                id: 'nav-1',
                type: 'navigate',
                target: 'https://console.aws.amazon.com',
            }

            const result = await agent.executeTask(task)

            expect(result.taskId).toBe('nav-1')
            expect(result.status).toBe('success')
            expect(result.extractedData).toHaveProperty('url')
        })

        it('should execute screenshot task and return base64 data', async () => {
            await agent.startSession()
            const task: NavigationTask = {
                id: 'screenshot-1',
                type: 'screenshot',
                target: 'S3 Bucket Settings',
            }

            const result = await agent.executeTask(task)

            expect(result.taskId).toBe('screenshot-1')
            expect(result.status).toBe('success')
            expect(result.screenshot).toBeDefined()
            expect(result.screenshot).toContain('data:image/svg+xml;base64')
        })

        it('should execute extract task and return data', async () => {
            await agent.startSession()
            const task: NavigationTask = {
                id: 'extract-1',
                type: 'extract',
                target: 'aws-mfa',
            }

            const result = await agent.executeTask(task)

            expect(result.taskId).toBe('extract-1')
            expect(result.status).toBe('success')
            expect(result.extractedData).toBeDefined()
        })

        it('should add task to session tasks array', async () => {
            await agent.startSession()
            const task: NavigationTask = {
                id: 'click-1',
                type: 'click',
                target: 'button.submit',
            }

            await agent.executeTask(task)
            const session = agent.getSession()

            expect(session?.tasks).toHaveLength(1)
            expect(session?.tasks[0].id).toBe('click-1')
        })
    })

    describe('executeWorkflow', () => {
        it('should execute multiple tasks in sequence', async () => {
            const tasks: NavigationTask[] = [
                { id: 'nav-1', type: 'navigate', target: 'AWS Console' },
                { id: 'click-1', type: 'click', target: 'S3' },
                { id: 'screenshot-1', type: 'screenshot', target: 'Bucket List' },
            ]

            const { sessionId, results } = await agent.executeWorkflow(tasks)

            expect(sessionId).toBeDefined()
            expect(results).toHaveLength(3)
            expect(results.every(r => r.status === 'success')).toBe(true)
        })

        it('should end session after workflow completion', async () => {
            const tasks: NavigationTask[] = [
                { id: 'nav-1', type: 'navigate', target: 'Test' },
            ]

            await agent.executeWorkflow(tasks)
            const session = agent.getSession()

            expect(session?.status).toBe('completed')
            expect(session?.completedAt).toBeDefined()
        })
    })

    describe('endSession', () => {
        it('should mark session as completed', async () => {
            await agent.startSession()
            await agent.endSession()

            const session = agent.getSession()
            expect(session?.status).toBe('completed')
            expect(session?.completedAt).toBeDefined()
        })
    })
})

describe('VERIFICATION_WORKFLOWS', () => {
    it('should have awsS3Encryption workflow defined', () => {
        expect(VERIFICATION_WORKFLOWS.awsS3Encryption).toBeDefined()
        expect(VERIFICATION_WORKFLOWS.awsS3Encryption).toBeInstanceOf(Array)
        expect(VERIFICATION_WORKFLOWS.awsS3Encryption.length).toBeGreaterThan(0)
    })

    it('should have awsMfa workflow defined', () => {
        expect(VERIFICATION_WORKFLOWS.awsMfa).toBeDefined()
        expect(VERIFICATION_WORKFLOWS.awsMfa.length).toBeGreaterThan(0)
    })

    it('should have githubBranchProtection workflow defined', () => {
        expect(VERIFICATION_WORKFLOWS.githubBranchProtection).toBeDefined()
        expect(VERIFICATION_WORKFLOWS.githubBranchProtection.length).toBeGreaterThan(0)
    })

    it('should have oktaMfa workflow defined', () => {
        expect(VERIFICATION_WORKFLOWS.oktaMfa).toBeDefined()
        expect(VERIFICATION_WORKFLOWS.oktaMfa.length).toBeGreaterThan(0)
    })

    it('should have valid task types in workflows', () => {
        const validTypes = ['navigate', 'click', 'screenshot', 'verify', 'extract']

        Object.values(VERIFICATION_WORKFLOWS).forEach(workflow => {
            workflow.forEach(task => {
                expect(validTypes).toContain(task.type)
                expect(task.id).toBeDefined()
                expect(task.target).toBeDefined()
            })
        })
    })
})

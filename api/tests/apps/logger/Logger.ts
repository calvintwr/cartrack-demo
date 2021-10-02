import { describe } from 'mocha'
import { should } from 'chai'
import Logger from '../../../src/apps/logger/Logger'
import mock from 'mock-fs'
import { readFileSync } from 'fs'
import { join } from 'path'

should()

describe('Logger - path exist', () => {

    const dir = 'logs'
    const fileName = 'test-file.txt'

    before(() => {
        const mockParams: any = {}
        mockParams[dir] = {}
        mockParams[dir][fileName] = ''
        mock(mockParams)
    })

    after(() => {
        mock.restore()
    })

    it('should create directory and log', async() => {

        const logger = new Logger(dir, fileName, 'default')
        const message = 'test message'
        await logger.write('test message')
    
        const result = readFileSync(join(dir, fileName), 'utf8')
        result.should.equal(`${message}.\n`)

    })

})

describe('Logger - path do not exist', () => {

    const dir = 'logs'
    const fileName = 'test-file.txt'

    before(() => {
        const mockParams: any = {}
        mockParams[dir] = {}
        mockParams[dir][fileName] = ''
        mock(mockParams)
    })

    after(() => {
        mock.restore()
    })

    it('should create directory and log', async() => {

        const newDir = `${dir}/${dir}`

        const logger = new Logger(newDir, fileName, 'default')
        const message = 'test message'
        await logger.write('test message')
    
        const result = readFileSync(join(newDir, fileName), 'utf8')
        result.should.equal(`${message}.\n`)

    })

})
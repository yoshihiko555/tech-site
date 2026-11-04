import { describe, expect, it } from 'vitest'
import { isSideProject, WORK_KIND_LABEL, WORKS, type Work } from '../../app/data/works'

function work(kind: Work['kind']): Work {
  return { name: 'x', description: 'x', kind, stack: ['Go'], site: '', image: '/works/x.jpg', source: '' }
}

describe('isSideProject', () => {
  it('counts side projects only, even when an early work has a stack', () => {
    expect(isSideProject(work('side'))).toBe(true)
    expect(isSideProject(work('early'))).toBe(false)
  })
})

describe('WORKS', () => {
  it('gives every work a stack and a card label', () => {
    for (const item of WORKS) {
      expect(item.stack.length, item.name).toBeGreaterThan(0)
      expect(WORK_KIND_LABEL[item.kind], item.name).toBeTruthy()
    }
  })
})

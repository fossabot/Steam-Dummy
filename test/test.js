/* eslint-env mocha */
'use strict'

const fs = require('fs')
const path = require('path')
const makeDummy = require('../index.js')
const should = require('chai').should() // eslint-disable-line no-unused-vars
const platform = require('os').platform()
const arch = require('os').arch()
const {Registry} = require('rage-edit')

let winreg
let pathTo

if (process.env.CI === true) {
  if (platform === 'darwin') {
    pathTo = path.join(require('os').homedir(), 'Library', 'Application Support', 'Steam')
  } else if (platform === 'linux') {
    pathTo = path.join(require('os').homedir(), '.steam')
  } else if (platform === 'win32') {
    if (arch === 'ia32') {
      pathTo = path.join('C:', 'Program Files', 'Steam')
    } else if (arch === 'ia64') {
      pathTo = path.join('C:', 'Program Files (x86)', 'Steam')
    }
  }
} else {
  pathTo = path.join(__dirname, 'Dummy')
}

describe('SteamDummy', function () {
  this.slow(0)

  describe('#makeDummy()', function () {
    it('should not create the dummy if it exists, by default', async function defaultDontCreate () {
      this.timeout(4000)

      try {
        await makeDummy(pathTo)

        if (platform === 'linux' || platform === 'darwin') {
          fs.existsSync(path.join(pathTo, 'registry.vdf')).should.equal(true)
        } else if (platform === 'win32') {
          fs.existsSync(path.join(pathTo, 'skins', 'readme.txt')).should.equal(true)
          winreg = new Registry('HKCU\\Software\\Valve\\Steam')
          let val = await winreg.get('AutoLoginUser')
          val.should.equal('someusername')
        }
      } catch (err) {
        throw new Error(err)
      }
    })

    it('should create the dummy if it exists, if using force', async function createDummyForcibly () {
      this.timeout(4000)

      try {
        await makeDummy(pathTo, true)

        if (platform === 'linux' || platform === 'darwin') {
          fs.existsSync(path.join(pathTo, 'registry.vdf')).should.equal(true)
        } else if (platform === 'win32') {
          fs.existsSync(path.join(pathTo, 'skins', 'readme.txt')).should.equal(true)
          winreg = new Registry('HKCU\\Software\\Valve\\Steam')
          let val = await winreg.get('AutoLoginUser')
          val.should.equal('someusername')
        }
      } catch (err) {
        throw new Error(err)
      }
    })
  })
})

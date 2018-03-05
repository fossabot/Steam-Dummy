/* eslint-env mocha */
'use strict'

const fs = require('fs')
const path = require('path')
const SteamDummy = require('../index.js')
const should = require('chai').should() // eslint-disable-line no-unused-vars
const platform = require('os').platform()
const arch = require('os').arch()
const {Registry} = require('rage-edit')

let dummy = new SteamDummy()
let winreg
let pathTo

describe('SteamConfig', function () {
  describe('#makeDummy()', function () {
    it('should create the dummy data by force', async function createDummy () {
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

      try {
        await dummy.makeDummy(pathTo, true)

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

    it('should not create the dummy data if it already exists', async function createDummy () {
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

      try {
        await dummy.makeDummy(pathTo)

        if (platform === 'linux' || platform === 'darwin') {
          fs.existsSync(path.join(pathTo, 'registry.vdf')).should.equal(true)
        } else if (platform === 'win32') {
          fs.existsSync(path.join(pathTo, 'skins', 'readme.txt')).should.equal(true)
          let val = await winreg.get('AutoLoginUser')
          val.should.equal('someusername')
        }
      } catch (err) {
        throw new Error(err)
      }
    })
  })
})

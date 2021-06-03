import { expect } from 'chai';
import { getMacSystemProxy } from '../src/index';

describe("mac-system-proxy", () => {
    it("can get the Mac system proxy", async function () {
        if (process.platform !== 'darwin') return this.skip();

        expect(
            await getMacSystemProxy()
        ).to.deep.equal({
            "ExceptionsList": [
              "*.local",
              "169.254/16"
            ],
            "FTPPassive": "1"
        }); // Seems to be the default config, matches GitHub Actions runner at least
    });

    it("rejects the promise on non-Mac platforms", async function () {
        if (process.platform === 'darwin') return this.skip();

        const result = await getMacSystemProxy().catch(e => e);

        expect(result).to.be.instanceOf(Error);
        expect(result.message).to.include("spawn scutil");
    });
});
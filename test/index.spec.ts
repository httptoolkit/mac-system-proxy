import { expect } from 'chai';
import { getMacSystemProxy } from '../src/index';

describe("mac-system-proxy", () => {
    it("can get the Mac system proxy", async () => {
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
});
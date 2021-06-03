import { parseScutilOutput } from '../src/parse-scutil';

describe("Scutil Parsing", () => {
    it("should parse an empty proxy configuration", () => {
        const parsed = parseScutilOutput(
`
`
        );
    });

    it("should parse a complete proxy configuration", () => {
        const parsed = parseScutilOutput(
`
`
        );
    });
});
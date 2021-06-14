import { expect } from 'chai';
import { parseScutilOutput } from '../src/parse-scutil';

describe("Scutil Parsing", () => {

    it("should parse an empty proxy configuration", () => {
        const parsed = parseScutilOutput(
`<dictionary> {
}`);

        expect(parsed).to.deep.equal({});
    });

    it("should parse a disabled proxy configuration", () => {
        const parsed = parseScutilOutput(
`<dictionary> {
    HTTPEnable : 0
    HTTPSEnable : 0
}`);

        expect(parsed).to.deep.equal({
            HTTPEnable: "0",
            HTTPSEnable: "0"
        });
    });

    it("should parse an empty proxy configuration with an exceptions array", () => {
        const parsed = parseScutilOutput(
`<dictionary> {
    ExceptionsList : <array> {
        0 : localhost
        1 : 127.0.0.1
    }
    ExcludeSimpleHostnames : 1
    HTTPEnable : 0
    HTTPSEnable : 0
}`);

        expect(parsed).to.deep.equal({
            ExceptionsList: ['localhost', '127.0.0.1'],
            ExcludeSimpleHostnames: "1",
            HTTPEnable: "0",
            HTTPSEnable: "0"
        });
    });

    it("should parse an empty proxy configuration with blank auth details", () => {
        const parsed = parseScutilOutput(
`<dictionary> {
    HTTPEnable : 0
    HTTPSEnable : 0
    HTTPSUser :${' '}
    HTTPUser :${' '}
}`);

        expect(parsed).to.deep.equal({
            HTTPEnable: "0",
            HTTPSEnable: "0",
            HTTPSUser: "",
            HTTPUser: ""
        });
    });

    it("should parse an HTTP and HTTPS proxy configuration", () => {
        const parsed = parseScutilOutput(
`<dictionary> {
    ExcludeSimpleHostnames : 1
    HTTPEnable : 1
    HTTPPort : 8000
    HTTPProxy : 127.0.0.1
    HTTPSEnable : 1
    HTTPSPort : 8443
    HTTPSProxy : 127.0.0.1
    HTTPSUser : user
    SOCKSEnable : 0
    SOCKSUser : user
}`);

        expect(parsed).to.deep.equal({
            "ExcludeSimpleHostnames": "1",
            "HTTPEnable": "1",
            "HTTPPort": "8000",
            "HTTPProxy": "127.0.0.1",
            "HTTPSEnable": "1",
            "HTTPSPort": "8443",
            "HTTPSProxy": "127.0.0.1",
            "HTTPSUser": "user",
            "SOCKSEnable": "0",
            "SOCKSUser": "user"
        });
    });

    it("should parse an WPAD PAC proxy configuration", () => {
        const parsed = parseScutilOutput(
`<dictionary> {
    ExceptionsList : <array> {
        0 : localhost
        1 : 127.0.0.1
    }
    ExcludeSimpleHostnames : 1
    HTTPEnable : 0
    HTTPSEnable : 0
    ProxyAutoConfigEnable : 1
    ProxyAutoConfigURLString : http://wpad/wpad.dat
    ProxyAutoDiscoveryEnable : 1
}`);

        expect(parsed).to.deep.equal({
            ExceptionsList: ['localhost', '127.0.0.1'],
            ExcludeSimpleHostnames: "1",
            HTTPEnable: "0",
            HTTPSEnable: "0",
            ProxyAutoConfigEnable: "1",
            ProxyAutoConfigURLString: "http://wpad/wpad.dat",
            ProxyAutoDiscoveryEnable: "1"
        });
    });

    it("should parse a SOCKS proxy configuration", () => {
        const parsed = parseScutilOutput(
`<dictionary> {
    ExcludeSimpleHostnames : 1
    HTTPEnable : 0
    HTTPSEnable : 0
    SOCKSEnable : 1
    SOCKSPort : 2020
    SOCKSProxy : 127.0.0.1
    SOCKSUser : user
}`);

        expect(parsed).to.deep.equal({
            "ExcludeSimpleHostnames": "1",
            "HTTPEnable": "0",
            "HTTPSEnable": "0",
            "SOCKSEnable": "1",
            "SOCKSPort": "2020",
            "SOCKSProxy": "127.0.0.1",
            "SOCKSUser": "user",
        });
    });

    it("should parse an explicit PAC configuration", () => {
        const parsed = parseScutilOutput(
`<dictionary> {
    ExcludeSimpleHostnames : 1
    HTTPEnable : 0
    HTTPSEnable : 0
    ProxyAutoConfigEnable : 1
    ProxyAutoConfigURLString : http://example.com/proxy.pac
}`);

        expect(parsed).to.deep.equal({
            "ExcludeSimpleHostnames": "1",
            "HTTPEnable": "0",
            "HTTPSEnable": "0",
            "ProxyAutoConfigEnable": "1",
            "ProxyAutoConfigURLString": "http://example.com/proxy.pac"
        });
    });

    it("should parse a complex made-up output structure", () => {
        const parsed = parseScutilOutput(
`<dictionary> {
    InitialValue : :value:
    FirstArray : <array> {
    }
    SecondArray : <array> {
        0 : .
    }
    ThirdArray : <array> {
        0 : <dictionary> {
            inner-value : special{value}
        }
    }
    Value : <dictionary> {
        a : b
        c : d
    }
}`);

        expect(parsed).to.deep.equal({
            InitialValue: ":value:",
            FirstArray: [],
            SecondArray: ['.'],
            ThirdArray: [
                { "inner-value": "special{value}" }
            ],
            Value: {
                a: 'b',
                c: 'd'
            }
        });
    });

    it("should clearly error given invalid input", () => {
        expect(() =>
            parseScutilOutput(`{`)
        ).to.throw('Unexpected scutil proxy output format');
    });

    it("should clearly error given invalid input", () => {
        expect(() =>
            parseScutilOutput(
`<dictionary> {
    IncompleteValue :
}`)
        ).to.throw('Unexpected scutil proxy output format');
    });
});
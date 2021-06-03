const TYPE_KEY = "__scutil__type__";

// Quick hacky parser, which translates output into valid JSON:
export function parseScutilOutput(output: string): {} {
    try {
        const jsonFormattedString = output
            // Reduce type markers to just an inline __scutil__type__ marker on array objects:
            .replace(/<dictionary>/g, '')
            .replace(/<array> {/g, `{ ${TYPE_KEY} : array`)
            .split(/\s+/)
            .map((token) => {
                if (!token || token === ':' || token === '{' || token === '}') return token;
                else return '"' + token + '"';
            })
            .join(' ')
            .replace(/" "/g, '", "')
            .replace(/} "/g, '}, "');

        const data = JSON.parse(jsonFormattedString, (key, value) => {
            if (value[TYPE_KEY] === 'array') {
                delete value[TYPE_KEY];
                return Object.values(value);
            } else {
                return value;
            }
        });

        return data;
    } catch (e) {
        throw Object.assign(
            new Error("Unexpected scutil proxy output format"),
            { scutilOutput: output } // Attach output for debugging elsewhere
        );
    }
}
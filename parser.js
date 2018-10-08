function parseCMDLine() {
    flags = []
    args = []
    options = {}
    process.argv.forEach((e, i) => {
        if (i < 2) return;
        if (e.startsWith("-") && !e.startsWith("--")) {
            flags = flags.concat(e.substring(1).split(""));
            return;
        }
        if (e.startsWith("--") && e.includes("=")) {
            options[e.substring(2).split("=")[0]] = e.substring(2).split("=")[1];
            return;
        }
        args = args.concat(e);
    });
    return {"flags": flags, "args": args, "options": options}
}

module.exports = parseCMDLine();
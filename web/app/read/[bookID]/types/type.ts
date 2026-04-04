enum ThemeCodes {
    dark = "dark",
    light = "light",
    sepia = "sepia",
}

enum FontValues {
    small = "small",
    medium = "medium",
    large = "large",
    xlarge = "xlarge",
    xxlarge = "xxlarge",
}

interface Theme {
    code: ThemeCodes;
    name: string;
    value: object;
}

interface Font {
    code: FontValues;
    value: number;
}

const themes: Theme[] = [
    {
        code: ThemeCodes.light,
        name: "Sáng",
        value: {}
    },
    {
        code: ThemeCodes.dark,
        name: "Tối",
        value: {background: "#1a1a1a", color: "#d1d1d1"}
    },
    {
        code: ThemeCodes.sepia,
        name: "Sepia",
        value: {background: "#f4ecd8", color: "#5b4636"}
    }
]

const fonts: Font[] = [
    {
        code: FontValues.small,
        value: 14,
    },
    {
        code: FontValues.medium,
        value: 16,
    },
    {
        code: FontValues.large,
        value: 18,
    },
    {
        code: FontValues.xlarge,
        value: 20,
    },
    {
        code: FontValues.xxlarge,
        value: 24,
    },
]

export type {Theme, Font};
export {ThemeCodes, FontValues, themes, fonts}
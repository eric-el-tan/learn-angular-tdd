export interface Config {
    configName: string;
    configValue: ConfigValue[];
}

export interface ConfigValue {
    key: string;
    value: string;
}
import {StatsInterval} from "../../../environments/enums";

export class ProjectRequestStatsInterval {
  key: StatsInterval;
  value: string;
  constructor(key: StatsInterval, value: string) {
    this.key = key;
    this.value = value;
  }
}

export class GatewayRequestSummary {
  totalRequest: number;
  requestsByVerbs: Map<string, number>;
  requestsByResponseCode: Map<string, number>;
  requestsByConsumer: Map<string, number>;
  requestsByTime: Map<string, number>;
}

import { warp_resolver } from '@terra-money/warp-sdk';
import { warp_templates } from '@terra-money/warp-sdk';

export class Template {
  // executions: Execution[];
  info: warp_templates.Template;
  condition: warp_resolver.Condition;
  msg: string;
  formatted_str: string;
  id: string;
  name: string;
  owner: string;
  vars: warp_templates.Variable[];

  constructor(info: warp_templates.Template) {
    this.info = info;
    this.condition = JSON.parse(info.executions[0].condition);
    this.msg = info.executions[0].msgs;
    this.vars = info.vars;
    this.formatted_str = info.formatted_str;
    this.id = info.id;
    this.name = info.name;
    this.owner = info.owner;
    this.vars = info.vars;
  }
}

import 'brace/mode/json';

export class CustomHighlightRules extends window.ace.acequire('ace/mode/json_highlight_rules').JsonHighlightRules {
  constructor() {
    super();
    this.$rules = {
      ...this.$rules,
      string: [
        // highlight text between curly braces with the 'highlighted_text' class
        { regex: /(\$warp\.variable\.[^"]*)/, token: 'highlighted_text' },
        ...this.$rules.string,
      ],
    };
  }
}

export default class CustomJsonSyntaxMode extends window.ace.acequire('ace/mode/json').Mode {
  constructor() {
    super();
    this.HighlightRules = CustomHighlightRules;
  }
}

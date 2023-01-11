import 'brace/mode/text';

export class CustomHighlightRules extends window.ace.acequire('ace/mode/text_highlight_rules').TextHighlightRules {
  constructor() {
    super();
    this.$rules = {
      start: [
        // highlight text between curly braces with the 'highlighted_text' class
        { regex: /{[^{}]+}/, token: 'highlighted_text' },
      ],
    };
  }
}

export default class CustomTextSyntaxMode extends window.ace.acequire('ace/mode/text').Mode {
  constructor() {
    super();
    this.HighlightRules = CustomHighlightRules;
  }
}

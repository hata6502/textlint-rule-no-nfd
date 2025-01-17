// LICENSE : MIT
"use strict";

var _matchIndex = require("match-index");

var _textlintRuleHelper = require("textlint-rule-helper");

var reporter = function reporter(context) {
  var {
    Syntax,
    RuleError,
    report,
    fixer,
    getSource
  } = context;
  var helper = new _textlintRuleHelper.RuleHelper(context);
  return {
    [Syntax.Str](node) {
      if (helper.isChildNode(node, [Syntax.Link, Syntax.Image, Syntax.BlockQuote, Syntax.Emphasis])) {
        return;
      }

      var text = getSource(node);
      (0, _matchIndex.matchCaptureGroupAll)(text, /([\u309b\u309c\u309a\u3099])/g).forEach((_ref) => {
        var {
          index
        } = _ref;

        if (index === 0) {
          return;
        } // \u309b\u309c => \u309a\u3099


        var dakutenChars = text.slice(index - 1, index + 1);
        var nfdlized = dakutenChars.replace("\u309B", "\u3099").replace("\u309C", "\u309A");
        var expectedText = nfdlized.normalize("NFC");
        var ruleError = new RuleError("Disallow to use NFD(well-known as UTF8-MAC \u6FC1\u70B9): \"".concat(dakutenChars, "\" => \"").concat(expectedText, "\""), {
          index,
          fix: fixer.replaceTextRange([index - 1, index + 1], expectedText)
        });
        report(node, ruleError);
      });
    }

  };
};

module.exports = {
  linter: reporter,
  fixer: reporter
};
//# sourceMappingURL=textlint-rule-no-nfd.js.map
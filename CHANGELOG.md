# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project tries to adhere to
[Semantic Versioning (SemVer)](https://semver.org/spec/v2.0.0.html).

<!--
	**Added** for new features.
	**Changed** for changes in existing functionality.
	**Deprecated** for soon-to-be removed features.
	**Removed** for now removed features.
	**Fixed** for any bug fixes.
	**Security** in case of vulnerabilities.
-->

## [0.1.1] - 2022-08-26

### Fixed
- Detect color-support within the **log** filter ([`52a93a9`](https://github.com/binyamin/nunjucks-cli/commit/52a93a9))
- In the **log** filter, print the primitive _value_ of a object-wrapped (boxed) primitive. ([`52a93a9`](https://github.com/binyamin/nunjucks-cli/commit/52a93a9)).

	Meaning, `Number('2')` returns the numeric value "2". In contrast, `new Number('2')` returns a [`Number` object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) which _contains_ the number "2". To access the number, we need to use the `.valueOf()` function.


## [0.1.0] - 2022-06-07

### Added
- Compile nunjucks files via the Node.js API or the command-line
- Optionally, load data files in JSON or YAML formats
- Add some helper filters and functions

[0.1.0]: https://github.com/binyamin/nunjucks-cli/releases/tag/v0.1.0
[0.1.1]: https://github.com/binyamin/nunjucks-cli/releases/tag/v0.1.1

package compiler

import "slices"

import "strings"

const goScriptBuildTag = "goscript"

func goScriptBuildFlags(flags []string) []string {
	normalized := append([]string(nil), flags...)
	for i, flag := range normalized {
		switch {
		case flag == "-tags" && i+1 < len(normalized):
			normalized[i+1] = appendBuildTag(normalized[i+1], goScriptBuildTag)
			return normalized
		case strings.HasPrefix(flag, "-tags="):
			normalized[i] = "-tags=" + appendBuildTag(strings.TrimPrefix(flag, "-tags="), goScriptBuildTag)
			return normalized
		}
	}
	return append(normalized, "-tags="+goScriptBuildTag)
}

func appendBuildTag(value string, tag string) string {
	tags := strings.FieldsFunc(value, func(r rune) bool {
		return r == ',' || r == ' ' || r == '\t' || r == '\n'
	})
	if slices.Contains(tags, tag) {
		return value
	}
	if strings.TrimSpace(value) == "" {
		return tag
	}
	if strings.ContainsAny(value, " \t\n") {
		return value + " " + tag
	}
	return value + "," + tag
}

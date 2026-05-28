package compiler

import (
	"slices"
	"strings"
)

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
		return strings.Join(tags, " ")
	}
	tags = append(tags, tag)
	if len(tags) == 0 {
		return ""
	}
	return strings.Join(tags, " ")
}

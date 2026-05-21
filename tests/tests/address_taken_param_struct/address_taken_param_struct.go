package main

type Format struct {
	Name string
	Ext  []string
}

var byName = make(map[string]*Format)
var byExt = make(map[string]*Format)

func registerFormat(f Format) {
	byName[f.Name] = &f
	for _, ext := range f.Ext {
		byExt[ext] = &f
	}
	f.Name = f.Name + "-updated"
}

func main() {
	registerFormat(Format{Name: "json", Ext: []string{"json"}})
	println(byName["json"].Name)
	println(byExt["json"].Name)
	byName["json"].Name = "mutated"
	println(byExt["json"].Name)
}

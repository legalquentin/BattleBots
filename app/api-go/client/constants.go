package client

const prefixErr = "[ERR](CONTROLS)"
const prefixLog = "[LOG](CONTROLS)"
const prefixWarn = "[WARN](CONTROLS)"

var Keymap = KeyMapStruct{
	KEY_LEFT:     37,
	KEY_UP:       38,
	KEY_RIGHT:    39,
	KEY_DOWN:     40,
	KEY_SPACEBAR: 32,
}

var QrMsgMissed = QrMsgStruct{
	Message: "You missed !",
	Id:      "0",
}

var QrCodesLinks = map[string]QrMsgStruct{
	"0": QrMsgMissed,
	"4": QrMsgStruct{"You've hit Rocinante !", "4"},
	"5": QrMsgStruct{"You've hit Razorback !", "5"},
}

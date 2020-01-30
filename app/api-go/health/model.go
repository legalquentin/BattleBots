package health

// Health struct return to check worker state
type Health struct {
	Message string `json:"message,omitempty"`
	Code    int    `json:"code,omitempty"`
}

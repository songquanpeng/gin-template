package common

const (
	StatusOk int = iota + 1000
	StatusError
	StatusPermissionDenied
	StatusInvalidParameter
	StatusUnexpectedError
	StatusRecordNotFound
)

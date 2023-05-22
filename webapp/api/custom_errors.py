from rest_framework import serializers, status


# used to raise custom error response codes by different views


class Http400BadRequest(serializers.ValidationError):
    status_code = status.HTTP_400_BAD_REQUEST


class Http401Unauthorized(serializers.ValidationError):
    status_code = status.HTTP_401_UNAUTHORIZED


# use when a request structure is valid, but there is some sort of data conflict which disallows the request
class Http409ConflictError(serializers.ValidationError):
    status_code = status.HTTP_409_CONFLICT


# use when a request structure is valid, but server rejects processing due to app functionality reasons
class Http422UnprocessableEntityError(serializers.ValidationError):
    status_code = status.HTTP_422_UNPROCESSABLE_ENTITY

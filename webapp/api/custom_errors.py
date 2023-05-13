from rest_framework import serializers, status


# used to raise custom error response codes by different views


# use when a request structure is valid, but server rejects processing due to app functionality reasons
class Http422UnprocessableEntityError(serializers.ValidationError):
    status_code = status.HTTP_422_UNPROCESSABLE_ENTITY

from rest_framework import permissions


# inherit from IsAuthenticated, therefore, by default in has_permission, ensure user.is_authenticated
class IsAuthenticatedAndOwner(permissions.IsAuthenticated):
    # declaration actually not necessary since inheriting from IsAuthenticated permission class, but kept for understanding on how it works
    def has_permission(self, request, view):
        return super().has_permission(request, view)

    def has_object_permission(self, request, view, obj):
        return obj.user == request.user

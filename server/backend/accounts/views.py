from .models import Accounts
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User, auth
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import logout
from django.http import JsonResponse
from rest_framework.authtoken.models import Token

@api_view(['POST'])
def login(request):
    username = request.data.get('username')
    password = request.data.get('password')

    user = auth.authenticate(username=username, password=password)
    if user is not None:
        token, _ = Token.objects.get_or_create(user=user)
        return Response({'success': True, 'token': token.key, 'message': 'Login successful'})
    else:
        return Response({'success': False, 'message': 'Invalid username or password'}, status=status.HTTP_401_UNAUTHORIZED)

@require_POST
@csrf_exempt 
def logout(request):

    auth.logout(request)

    return JsonResponse({'success': True, 'message': 'Successfully logged out.'})

@api_view(['POST'])
def signup(request):
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')
    dob = request.data.get('dob')

    if not (username and email and password and dob):
        return Response({'message': 'All fields are required'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        new_account = Accounts(username=username, password=password, email=email, dob=dob)
        new_account.save()

        user = User.objects.create_user(username=username, password=password, email=email)
        user.save()

        return Response({'message': 'User signed up successfully'})
    except Exception as e:
        return Response({'message': f'Failed to sign up user. Error: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)



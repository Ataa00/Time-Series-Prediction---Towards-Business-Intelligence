from django.http import JsonResponse
from rest_framework.decorators import api_view
from .methods import forecast

@api_view(['POST'])
def predict(request):
    if request.method == 'POST' and request.FILES.get('csv_file'):
        csv_file = request.FILES['csv_file']
        date_col_name = request.POST.get('date_col_name')
        target_col_name = request.POST.get('target_col_name')
        cycle_type = request.POST.get('cycle_type')
        period = int(request.POST.get('period'))
        res = forecast(csv_file, date_col_name, target_col_name, cycle_type, period)
        return JsonResponse(res)
    else:
        return JsonResponse({'error': 'POST request with two photos required'}, status=400)

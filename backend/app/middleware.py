import logging

logger = logging.getLogger(__name__)


class RequestLoggingMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Логирование каждого входящего запроса
        logger.info(f"Request: {request.method} {request.path} from {request.META.get('REMOTE_ADDR')}")

        response = self.get_response(request)

        # Логирование статуса ответа
        logger.info(f"Response: {response.status_code} for {request.method} {request.path}")

        return response

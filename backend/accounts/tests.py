from django.test import TestCase
from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status

User = get_user_model()


class TechPlacifyAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username="teststudent",
            email="teststudent@example.com",
            password="Password123!",
            stream=2
        )

    def test_register(self):
        url = reverse('auth_register')
        data = {
            "username": "newstudent",
            "email": "newstudent@example.com",
            "password": "Password123!",
            "confirm_password": "Password123!",
            "stream": 2
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

    def test_login(self):
        url = reverse('auth_login')
        data = {
            "username": "teststudent",
            "password": "Password123!"
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
        self.assertEqual(response.data['user']['email'], "teststudent@example.com")

    def test_password_reset_flow(self):
        reset_req_url = reverse('password_reset_request')
        res = self.client.post(reset_req_url, {"email": "teststudent@example.com"}, format='json')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        dev_url = res.data.get('dev_reset_url')
        self.assertIsNotNone(dev_url)

        # Extract uid and token from url: .../reset-password-confirm/{uid}/{token}
        parts = dev_url.strip('/').split('/')
        uid = parts[-2]
        token = parts[-1]

        confirm_url = reverse('password_reset_confirm')
        confirm_res = self.client.post(confirm_url, {
            "uid": uid,
            "token": token,
            "password": "NewSecretPassword123!",
            "confirm_password": "NewSecretPassword123!"
        }, format='json')
        self.assertEqual(confirm_res.status_code, status.HTTP_200_OK)

        # Verify login with new password
        login_res = self.client.post(reverse('auth_login'), {
            "username": "teststudent",
            "password": "NewSecretPassword123!"
        }, format='json')
        self.assertEqual(login_res.status_code, status.HTTP_200_OK)

    def test_predict_and_history(self):
        login_res = self.client.post(reverse('auth_login'), {
            "username": "teststudent",
            "password": "Password123!"
        }, format='json')
        token = login_res.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        predict_url = reverse('placement_predict')
        payload = {
            "student_name": "Test Student",
            "stream": 2,
            "cgpa": 8.5,
            "internships": 1,
            "projects": 2,
            "backlogs": 0,
            "skills": "python, dsa, sql, web development",
            "project_name_1": "TechPlacify",
            "project_domain_1": "Web / Full-Stack"
        }
        res = self.client.post(predict_url, payload, format='json')
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertIn('placement_chance', res.data)
        self.assertIn('company_tiers', res.data)
        self.assertIn('action_plan', res.data)

        # Test history endpoint
        history_url = reverse('prediction_history_list')
        h_res = self.client.get(history_url)
        self.assertEqual(h_res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(h_res.data), 1)
        self.assertEqual(h_res.data[0]['student_name'], "Test Student")

import rds_service
import json

def test_stats(user_id):
    stats = rds_service.get_dashboard_stats(user_id)
    print(json.dumps(stats, indent=2, default=str))

if __name__ == "__main__":
    test_stats(2)

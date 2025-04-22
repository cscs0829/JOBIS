# backend/services/test_milvus.py

from pymilvus import MilvusClient
import numpy as np

# 1. Milvus Lite 연결
client = MilvusClient("./milvus_demo.db")
print("✅ Milvus 연결 완료")

# 2. 컬렉션 생성 (한 번만 실행하면 됨)
client.create_collection(
    collection_name="demo_collection",
    dimension=4,  # 간단한 연습용 차원
    primary_field="id",
    fields=[
        {"name": "id", "type": "INT64", "is_primary": True, "auto_id": False},
        {"name": "vector", "type": "FLOAT_VECTOR"},
        {"name": "text", "type": "VARCHAR", "max_length": 200}
    ]
)
print("✅ 컬렉션 생성 완료")

from pymilvus import connections

# Milvus 서버에 연결 시도
connections.connect(alias="default", host="localhost", port="19530")

# 연결 정보 출력
print("Connection status:", connections.get_connection(alias="default"))
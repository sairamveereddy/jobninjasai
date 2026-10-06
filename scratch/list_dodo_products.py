
import asyncio
from dodopayments import AsyncDodoPayments
import os

async def list_products():
    token = "VlSrQp7v8yEwy3UB.Lzvf3GZC-wqETu11N-S8paVhoWjfyJfUHmPVDi-6g8HrvTaC"
    dodo_client = AsyncDodoPayments(bearer_token=token)
    try:
        # Check standard products
        products = await dodo_client.products.list(page_size=100)
        print("--- Products ---")
        for product in products.items:
            price = getattr(product, 'price', 'N/A')
            print(f"ID: {product.product_id}, Name: {product.name}, Price: {price}")
        
        # Check discount codes or other types if applicable, but usually it's products
    except Exception as e:
        print(f"Error listing products: {e}")

if __name__ == "__main__":
    asyncio.run(list_products())

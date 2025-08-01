import boto3
from boto3.dynamodb.conditions import Key

def query_dynamodb_table(table_name, partition_key_value, sort_key_value=None, region_name='us-west-2'):
    """
    Queries a DynamoDB table based on the partition key and optional sort key.

    Args:
        table_name (str): The name of the DynamoDB table to query.
        partition_key_value (str): The value of the partition key for the query.
        sort_key_value (str, optional): The value of the sort key for the query.
                                        Required if the table has a composite primary key.
        region_name (str): The AWS region where the DynamoDB table is located.

    Returns:
        list: A list of items returned by the query, or an empty list if no items are found.
    """
    dynamodb = boto3.resource('dynamodb', region_name=region_name)
    table = dynamodb.Table(table_name)

    try:
        if sort_key_value:
            # Query with both partition and sort key
            response = table.query(
                KeyConditionExpression=Key('ID').eq(partition_key_value) &
                                     Key('your_sort_key_name').eq(sort_key_value)
            )
        else:
            # Query with only partition key
            response = table.query(
                KeyConditionExpression=Key('ID').eq(partition_key_value)
            )
        return response['Items']
    except Exception as e:
        print(f"Error querying DynamoDB: {e}")
        return []

if __name__ == "__main__":
    # Replace with your actual table name and key names
    my_table_name = 'FireWire_test_v1'
    my_partition_key_name = 'ID'  # Example: 'ProductId'
    # my_sort_key_name = 'SKU'             # Example: 'SKU' (if applicable)

    # Example 1: Querying with only the partition key
    print(f"Querying table '{my_table_name}' for ID='0':")
    partition_key_value = 0
    items = query_dynamodb_table(my_table_name, partition_key_value)
    if items:
        for item in items:
            print(item)
    else:
        print("No items found for this ID.")

    print("\n" + "="*30 + "\n")
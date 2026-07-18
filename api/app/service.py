# Read data from Databricks SQL using the Databricks SQL Connector for Python
# References:
# - https://docs.databricks.com/aws/en/dev-tools/python-sql-connector
# - https://docs.databricks.com/aws/en/dev-tools/auth/pat#pat-user

from typing import List
from databricks import sql
import os

from .schema import ConditionCount


def get_condition_counts():
    """
    Fetches the count of conditions grouped by gender and condition description from
    the Databricks SQL database.
    Returns:
        List[ConditionCount]: A list of ConditionCount objects containing the gender,
        condition description, and the count of each condition.
    """
    query = """
    SELECT p.gender, c.condition_description, COUNT(*) AS condition_count
    FROM learning.synthea.conditions c
    JOIN learning.synthea.patients p ON c.patient_id = p.patient_id
    GROUP BY p.gender, c.condition_description
    ORDER BY condition_count DESC LIMIT 20;
    """
    try:
        formatted_data: List[ConditionCount] = []
        with sql.connect(
            server_hostname=os.getenv("DATABRICKS_SERVER_HOSTNAME"),
            http_path=os.getenv("DATABRICKS_HTTP_PATH"),
            access_token=os.getenv("DATABRICKS_TOKEN"),
        ) as connection:

            with connection.cursor() as cursor:
                cursor.execute(query)
                result = cursor.fetchall()

                for row in result:
                    formatted_data.append(
                        ConditionCount(
                            gender=row.gender,
                            condition_description=row.condition_description,
                            condition_count=row.condition_count,
                        )
                    )
        return formatted_data
    except Exception as e:
        print(f"Error executing query: {e}")

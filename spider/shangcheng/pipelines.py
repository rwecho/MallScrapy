# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://docs.scrapy.org/en/latest/topics/item-pipeline.html


# useful for handling different item types with a single interface
from itemadapter import ItemAdapter
import json
import os
from datetime import datetime


class ShangchengPipeline:

    def __init__(self):
        self.items = []

    def open_spider(self, spider):
        pass

    def process_item(self, item, spider):

        self.items.append({**dict(item), 'index': len(self.items)})
        return item

    def close_spider(self, spider):
        _type = spider.mall_type
        now = datetime.now().strftime("%Y-%m-%d")

        file = os.path.join(os.getcwd(), "..", "web", "public", "app_data")
        if not os.path.exists(file):
            os.mkdir(file)
        if _type == "tmall":
            file = os.path.join(file, f"tmall_{now}.json")
        elif _type == "jd":
            file = os.path.join(file, f"jd_{now}.json")
        elif _type == "duoduo":
            file = os.path.join(file, f"duoduo_{now}.json")
        else:
            raise NotImplementedError(f"Unknow type {_type}")

        with open(file, 'w') as f:
            json.dump(self.items, f)

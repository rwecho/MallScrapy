# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://docs.scrapy.org/en/latest/topics/item-pipeline.html


# useful for handling different item types with a single interface
from datetime import datetime
import pymongo

from .settings import MONGO_CONNECTION


class ShangchengPipeline:

    def __init__(self):
        self.items = []
        self.client = pymongo.MongoClient(MONGO_CONNECTION)
        scrapy_db = self.client['scrapy_mall']                # 创建数据库
        self.coll = scrapy_db['products']              # 创建jd表格
        self.index = 0
        self.date = datetime.now()

    def open_spider(self, spider):
        _type = spider.mall_type
        keywords = spider.keywords
        day = self.date.strftime("%Y-%m-%d")
        self.coll.delete_many({"keywords": keywords,
                               "type": _type,
                               'creation_day': day, })

    def process_item(self, item, spider):
        _type = spider.mall_type
        keywords = spider.keywords
        day = self.date.strftime("%Y-%m-%d")

        item = {**dict(item),
                'index': self.index,
                'creation': self.date,
                'creation_day': day,
                'keywords': keywords,
                "type": _type}
        self.coll.insert_one(dict(item))
        self.index += 1
        return item

    def close_spider(self, spider):
        self.client.close()

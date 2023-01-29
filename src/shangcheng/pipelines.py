# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://docs.scrapy.org/en/latest/topics/item-pipeline.html


# useful for handling different item types with a single interface
from itemadapter import ItemAdapter
import json


class ShangchengPipeline:

    def __init__(self):
        self.items = []

    def open_spider(self, spider):
        pass

    def process_item(self, item, spider):
        self.items.append(item)
        return item

    def close_spider(self, spider):
        with open('data.json', 'w') as f:
            json.dump(self.items, f)
        print('1111')

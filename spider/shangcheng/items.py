# Define here the models for your scraped items
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/items.html

from scrapy import Item, Field


class ShangchengItem(Item):
    # define the fields for your item here like:
    # name = scrapy.Field()
    name = Field()
    sort = Field()
    index = Field()
    keyword = Field()
    price = Field()
    store = Field()
    evaluate_num = Field()
    image = Field()
    url = Field()

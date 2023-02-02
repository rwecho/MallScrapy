import scrapy

from shangcheng.items import ShangchengItem
from scrapy import Request, Spider
from shangcheng.settings import SEARCH_KEYWORDS
import re


class JdSpider(Spider):
    name = 'jd'
    allowed_domains = ['search.jd.com']
    keywords = SEARCH_KEYWORDS
    keywords = [x.strip() for x in re.split('; |,', keywords)]
    mall_type = "jd"

    def start_requests(self):
        for keyword in self.keywords:
            start_url = f'https://search.jd.com/Search?keyword={keyword}&enc=utf-8'
            yield Request(url=start_url, callback=self.parse, meta={"keyword": keyword}, dont_filter=True)

    def parse(self, response):
        products = response.xpath('.//ul[@class="gl-warp clearfix"]/li')
        keyword = response.meta["keyword"]
        for index, product in enumerate(products):
            item = ShangchengItem()
            item['index'] = index
            item['keyword'] = keyword
            item['url'] = ''.join(product.xpath(
                './/div[@class="p-img"]/a/@href').extract()).strip()
            # 图片的获取不稳定, 因为它是可见后才有具体的地址
            item['image'] = ''.join(product.xpath(
                './/div[@class="p-img"]/a/img/@src').extract()).strip()
            item['name'] = ''.join(product.xpath(
                './/div[@class="p-name p-name-type-2"]/a/em/text()').extract()).strip()
            item['price'] = ''.join(product.xpath(
                './/div[@class="p-price"]/strong/*/text()').extract()).strip()
            item['store'] = ''.join(product.xpath(
                './/div[@class="p-shop"]/span/a/text()').extract()).strip()
            item['evaluate_num'] = ''.join(product.xpath('.//div[@class="p-commit"]/strong/a/text()').extract(
            )).strip()+''.join(product.xpath('.//div[@class="p-commit"]/strong/text()').extract()).strip()
            yield item

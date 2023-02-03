import scrapy
from scrapy import Request, Spider
from shangcheng.items import ShangchengItem
from shangcheng.settings import SEARCH_KEYWORDS
import re


class TmallSpider(scrapy.Spider):
    name = 'tmall'
    allowed_domains = ['s.taobao.com']
    keywords = SEARCH_KEYWORDS
    keywords = [x.strip() for x in re.split('; |,', keywords)]
    mall_type = "tmall"

    def start_requests(self):
        for keyword in self.keywords:
            # 按综合排序
            start_url = f'https://s.taobao.com/search?q={keyword}'
            yield Request(url=start_url, callback=self.parse, meta={"keyword": keyword, "sort": "综合"}, dont_filter=True)

        for keyword in self.keywords:
            # 按照销量排序
            start_url = f'https://s.taobao.com/search?q={keyword}&sort=sale-desc'
            yield Request(url=start_url, callback=self.parse, meta={"keyword": keyword, "sort": "销量"}, dont_filter=True)

    def parse(self, response):
        products = response.xpath(
            './/div[@class="grid g-clearfix"]//div[contains(@class, "item J_MouserOnverReq") and not(contains(@class, "item-ad"))]')
        keyword = response.meta["keyword"]
        sort = response.meta["sort"]

        for index, product in enumerate(products):
            item = ShangchengItem()
            item['index'] = index
            item['keyword'] = keyword
            item['sort'] = sort
            item['url'] = ''.join(product.xpath(
                './/div[@class="pic"]/a/@href').extract()).strip()
            # 图片的获取不稳定, 因为它是可见后才有具体的地址
            item['image'] = ''.join(product.xpath(
                './/div[@class="pic"]/a/img/@src').extract()).strip()
            item['name'] = ''.join(product.xpath(
                './/div[contains(@class, "ctx-box")]//div[contains(@class,"title")]/descendant::*/text()').extract()).strip()
            item['price'] = ''.join(product.xpath(
                './/div[contains(@class, "ctx-box")]//div[@class="deal-cnt"]/text()').extract()).strip()
            item['store'] = ''.join(product.xpath(
                './/div[contains(@class, "ctx-box")]//div[contains(@class,"shop")]/a/span/text()').extract()).strip()
            item['evaluate_num'] = \
                ''.join(product.xpath('.//div[contains(@class, "ctx-box")]//div[contains(@class,"price")]/span/text()')
                        .extract()).strip() +\
                ''.join(product.xpath('.//div[contains(@class, "ctx-box")]//div[contains(@class, "price")]/strong/text()')
                        .extract()).strip()
            yield item

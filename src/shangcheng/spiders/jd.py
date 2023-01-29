import scrapy

from shangcheng.items import ShangchengItem
from scrapy import Request, Spider


class JdSpider(Spider):
    name = 'jd'
    allowed_domains = ['search.jd.com']
    start_urls = ['https://search.jd.com/Search?keyword=手机&enc=utf-8']

    def start_requests(self):
        for url in self.start_urls:
            yield Request(url=url, callback=self.parse, meta={'type': 'jd'}, dont_filter=True)

    def parse(self, response):
        products = response.xpath('.//ul[@class="gl-warp clearfix"]/li')
        for product in products:
            item = ShangchengItem()
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

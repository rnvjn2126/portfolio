"""Temporary, synthetic fixtures for a genuine Steel Quotes screenshot run.

Executed only inside a disposable GitHub Actions checkout of testproj.
No demo database or credentials are committed to either repository.
"""
import json
import os
import secrets
from datetime import timedelta
from decimal import Decimal
from pathlib import Path

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "steel_quotes.settings")
import django
django.setup()

from django.contrib.auth import get_user_model
from django.utils import timezone
from dashboard.models import Customer, Supplier, Product, RFQ, RFQLine, SupplierOffer, FollowUp, Quote, QuoteLine

D = Decimal
today = timezone.localdate()
username = "portfolio_steel_demo"
password = secrets.token_urlsafe(30)
user = get_user_model().objects.create_user(username=username, password=password)

customer = Customer.objects.create(
    owner=user, name="Northpoint Fabrication (Demo)",
    company_name="Northpoint Fabrication, sample business",
    notes="Synthetic account created solely for the portfolio walkthrough",
)
Customer.objects.create(owner=user, name="Summit Structures (Demo)")
Customer.objects.create(owner=user, name="Eastgate Industrial (Demo)")

supplier_a = Supplier.objects.create(owner=user, name="Greenfield Metals (Demo)")
supplier_b = Supplier.objects.create(owner=user, name="Harbor Steel Supply (Demo)")
Supplier.objects.create(owner=user, name="Southern Alloy Traders (Demo)")

bar = Product.objects.create(
    owner=user, name="SS304 Round Bar, 25 mm", grade="SS304",
    shape=Product.Shape.ROUND_BAR, dimensions="25 mm diameter",
    unit=Product.Unit.KG,
)
plate = Product.objects.create(
    owner=user, name="MS Plate, 6 mm", grade="IS 2062",
    shape=Product.Shape.PLATE, dimensions="1250 x 2500 x 6 mm",
    unit=Product.Unit.KG,
)
Product.objects.create(
    owner=user, name="Mild Steel Angle, 40 mm", grade="IS 2062",
    shape=Product.Shape.ANGLE, dimensions="40 x 40 x 5 mm",
    unit=Product.Unit.KG,
)
Product.objects.create(
    owner=user, name="SS316 Sheet, 2 mm", grade="SS316",
    shape=Product.Shape.SHEET, dimensions="2 m x 1 m x 2 mm",
    unit=Product.Unit.KG,
)

rfq = RFQ.objects.create(
    owner=user, customer=customer, reference="ENQ-DEMO-1042",
    source=RFQ.Source.EMAIL, received_on=today - timedelta(days=1),
    required_by=today + timedelta(days=12),
    status=RFQ.Status.IN_PROGRESS,
    notes="Synthetic enquiry for steel supply and landed cost comparison.",
)
line_bar = RFQLine.objects.create(
    owner=user, rfq=rfq, product=bar, grade=bar.grade, dimensions=bar.dimensions,
    quantity=D("250.000"), unit=Product.Unit.KG,
)
line_plate = RFQLine.objects.create(
    owner=user, rfq=rfq, product=plate, grade=plate.grade, dimensions=plate.dimensions,
    quantity=D("400.000"), unit=Product.Unit.KG,
)

def offer(line, supplier, price, freight, packing, days):
    record = SupplierOffer(
        owner=user, rfq_line=line, supplier=supplier,
        available_quantity=line.quantity, unit=Product.Unit.KG,
        unit_price=D(price), freight_cost=D(freight),
        packaging_cost=D(packing), delivery_days=days,
    )
    record.full_clean()
    record.save()
    return record

bar_offer = offer(line_bar, supplier_a, "174.5000", "600.00", "150.00", 4)
offer(line_bar, supplier_b, "176.0000", "250.00", "150.00", 3)
plate_offer = offer(line_plate, supplier_a, "64.5000", "900.00", "200.00", 6)
offer(line_plate, supplier_b, "65.2500", "500.00", "100.00", 5)

FollowUp.objects.create(owner=user, rfq=rfq,
                        due_on=today + timedelta(days=2),
                        note="Confirm revised lead time for stainless round bars.")

# A second enquiry makes pipeline and dashboard screenshots representative.
customer2 = Customer.objects.get(owner=user, name="Summit Structures (Demo)")
rfq2 = RFQ.objects.create(
    owner=user, customer=customer2, reference="ENQ-DEMO-1043",
    source=RFQ.Source.PHONE, received_on=today,
    required_by=today + timedelta(days=9),
    status=RFQ.Status.NEW,
)
RFQLine.objects.create(
    owner=user, rfq=rfq2, product=bar,
    quantity=D("150.000"), unit=Product.Unit.KG,
)
FollowUp.objects.create(owner=user, rfq=rfq2,
                        due_on=today + timedelta(days=3),
                        note="Send sample technical specification and pricing.")

quote = Quote.objects.create(
    owner=user, rfq=rfq, number="SQ-DEMO-0042",
    revision=1, issue_date=today,
    valid_until=today + timedelta(days=8),
    tax_rate_percent=D("18.00"),
    payment_terms="50% advance against order, balance before dispatch.",
    delivery_terms="Ex works, 5 to 7 working days after confirmation.",
    target_margin_percent=D("12.00"),
    minimum_margin_percent=D("8.00"),
    maximum_discount_percent=D("5.00"),
    status=Quote.Status.READY,
)
for line, selected, selling in [
    (line_bar, bar_offer, "202.0000"),
    (line_plate, plate_offer, "77.5000"),
]:
    landed = selected.landed_cost_per_requested_unit
    item = QuoteLine(
        owner=user, quote=quote, rfq_line=line, supplier_offer=selected,
        quantity=line.quantity, unit=Product.Unit.KG,
        landed_cost_per_unit=landed.quantize(D("0.0001")),
        discount_percent=D("0.00"),
        selling_price_per_unit=D(selling),
    )
    item.full_clean()
    item.save()

assert quote.total_selling_price > quote.total_landed_cost
assert quote.gross_margin_percent >= D("8.00")
assert all(x.covers_full_quantity for x in [bar_offer, plate_offer])

access = {
    "username": username,
    "password": password,
    "rfq_id": rfq.pk,
    "quote_id": quote.pk,
}
Path("/tmp/steel-portfolio-demo-access.json").write_text(json.dumps(access))
print(
    "Created synthetic demo records:",
    Customer.objects.filter(owner=user).count(), "customers;",
    Supplier.objects.filter(owner=user).count(), "suppliers;",
    Product.objects.filter(owner=user).count(), "products;",
    RFQ.objects.filter(owner=user).count(), "enquiries;",
    Quote.objects.filter(owner=user).count(), "quotation."
)

# Submission remarks

I have completed an SEO audit of Funngro's website and a two-page redesign of its Teen (/earn) and Company (/about) pages. The audit found that the live pages render only through JavaScript (crawlers receive an empty HTML shell), /teen and unknown URLs return HTTP 200 instead of redirecting or 404ing, canonicals point to a redirecting host, and social tags are reused. The redesign fixes these with static HTML, clean redirects, accurate metadata, validated Schema.org data and optimised images, using only verified company facts. Testing on the live site: Lighthouse Performance and Accessibility 100 on both pages, zero axe-core violations, plus keyboard, link and validation checks. The evaluation site is intentionally noindex.

Report: delivery/Funngro-Website-SEO-Audit-Report.pdf
Live: https://funngro-revamp-evaluation.netlify.app/earn · https://funngro-revamp-evaluation.netlify.app/about
Code: https://github.com/The-enlit-dev/funggro-website-revamp/pull/1

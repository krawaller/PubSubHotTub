
load('/Library/Ruby/Gems/1.8/gems/visionmedia-jspec-2.11.2/lib/jspec.js')
load('/Library/Ruby/Gems/1.8/gems/visionmedia-jspec-2.11.2/lib/growl.js')
load('lib/pubsub.hottub.js')

JSpec
.exec('spec/spec.core.js')
.run({ formatter: JSpec.formatters.Terminal })
.report()

Growl.notify(
	[
		["Passes", JSpec.stats.passes].join(": "),
		["Failures", JSpec.stats.failures].join(": ")
	]
	.join("\n"),

	{ title: 'pubsub.hottub.js', image: 'Aptana' }
)
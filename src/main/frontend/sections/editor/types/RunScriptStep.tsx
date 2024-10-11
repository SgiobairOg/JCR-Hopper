import React, { FC, useContext } from 'react';

import { Hop } from '../../../model/hops';
import { StepEditor } from '../../../widgets/StepEditor';

import { SCRIPT_LANGUAGES, shortDescription, title, Type } from '../../../model/hops/runScript';
import { Help } from '../../../widgets/Help';
import { Select } from '../../../widgets/Select';
import { CodeEditor } from '../../../widgets/CodeEditor';
import { ScriptContext } from '../../../App';
import { Switch } from '../../../widgets/Switch';

export const RunScriptStep: FC<{ parentHops: Hop[]; hop: Type }> = ({ parentHops, hop }) => {
	const scriptContext = useContext(ScriptContext);

	return (
		<StepEditor parentHops={parentHops} hop={hop} title={shortDescription(hop)}>
			<Select
				label="Language"
				list={Object.entries(SCRIPT_LANGUAGES) as [keyof typeof SCRIPT_LANGUAGES, string][]}
				value={hop.extension}
				onChange={extension => (hop.extension = extension)}
			/>
			<CodeEditor
				language={hop.extension}
				lines={10}
				value={hop.code}
				onChange={code => {
					hop.code = code;
					scriptContext.commit();
				}}
			/>
			<Switch
				label="Put Locals Back Into Scope"
				value={hop.putLocalsBackIntoScope ?? false}
				onChange={putLocalsBackIntoScope => (hop.putLocalsBackIntoScope = putLocalsBackIntoScope)}
			/>
			<Help title={title}>
				<h5>{SCRIPT_LANGUAGES[hop.extension]} Script Code</h5>
				<p>
					The {SCRIPT_LANGUAGES[hop.extension]} script code to run.
					<br />
					{hop.extension === 'jexl' ? (
						<small>
							See the{' '}
							<a href="https://commons.apache.org/proper/commons-jexl/reference/syntax.html">
								Syntax Reference.
							</a>
						</small>
					) : (
						<small>
							See the{' '}
							<a href="https://www.oracle.com/technical-resources/articles/java/jf14-nashorn.html">
								Nashorn Guide.
							</a>
						</small>
					)}
				</p>
				<p>
					The standard variables for expressions are available:
					<ul>
						<li>
							<code>node</code>: The current node being processed
						</li>
						<li>Variables generated by queries and iterations</li>
						<li>Any variables manually defined</li>
					</ul>
					Additionally, the following variables are available:
					<ul>
						<li>
							<code>log</code>: A logger object you can use.
							<br />
							It comes with methods for the following log levels:
							<ul>
								<li>trace</li>
								<li>debug</li>
								<li>info</li>
								<li>warn</li>
								<li>error</li>
							</ul>
						</li>
						<li>
							<code>writer</code>: The output writer. You can call <code>println</code> on it to generate
							output in the response.
						</li>
						<li>
							<code>utils</code>: All utilities. These are the classes or objects usually available in JEXL
							as <code>«name»:«method»()</code>. In script blocks of non-JEXL languagees, these will be
							available as <code>utils.«name».«method»()</code>.
						</li>
						<li>
							<code>args</code>: Arguments passed to the script (or the corresponding parameter’s default
							values).
						</li>
					</ul>
				</p>
				<h5>Put Locals Back Into Scope</h5>
				<p>If this is set, all local variables your script creates will be available in subsequent hops.</p>
			</Help>
		</StepEditor>
	);
};

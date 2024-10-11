import React, { FC, Fragment, useContext } from 'react';
import { styled } from 'goober';

import { Hop } from '../../../model/hops';
import { StepEditor } from '../../../widgets/StepEditor';
import { ScriptContext } from '../../../App';

import { shortDescription, Type } from '../../../model/hops/declare';
import { Help } from '../../../widgets/Help';
import { Input } from '../../../widgets/Input';

const Elm = styled('fieldset')`
	display: grid;
	gap: 6px;
	grid-auto-flow: row;
	grid-template-columns: 1fr 2fr;
`;

export const DeclareStep: FC<{ parentHops: Hop[]; hop: Type }> = ({ parentHops, hop }) => {
	const scriptContext = useContext(ScriptContext);

	const declarations = (hop.declarations ??= {});

	return (
		<StepEditor parentHops={parentHops} hop={hop} title={shortDescription(hop)}>
			<Elm>
				<legend>Declarations</legend>
				{Object.entries(declarations)
					.sort()
					.map(([varName, varValue]) => (
						<Fragment key={varName}>
							<label>
								Name:{' '}
								<Input
									placeholder="Variable Name"
									value={varName}
									onChange={newVar => {
										delete declarations[varName];
										if (newVar) {
											declarations[newVar] = varValue;
										}
									}}
								/>
							</label>
							<label>
								Value:
								<Input
									placeholder="Variable Value"
									value={varValue}
									onChange={newValue => {
										declarations[varName] = newValue;
									}}
								/>
							</label>
						</Fragment>
					))}
			</Elm>
			<button
				style={{ justifySelf: 'start' }}
				is="coral-button"
				icon="boxAdd"
				onClick={() => {
					let name = 'variable';
					let i = 1;
					while (name in declarations) {
						name = 'variable' + i;
						i++;
					}
					declarations[name] = '';
					scriptContext.commit();
				}}
			/>
			<Help title="Declarations">
				<p>
					Makes the declared variables available in the descendant pipeline. Useful if you use the same expression many
					times. Note that the values are JEXL expressions already so you should not use <code>{'${}'}</code>.
				</p>
			</Help>
		</StepEditor>
	);
};

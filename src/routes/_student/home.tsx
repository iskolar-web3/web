import { useState, useEffect, type JSX } from "react";
import {
	createFileRoute,
	Link,
	useNavigate,
	useSearch,
} from "@tanstack/react-router";
import {
	Calendar,
	Users,
	Coins,
	Files,
	ArrowRight,
	UserIcon,
	Clock,
	CheckCircle,
	XCircle,
	Award,
	FileText,
	Filter,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useApplications } from "@/hooks/useApplications";
import ApplicationDetailsModal, {
	statusStyles,
} from "@/components/student/home/ApplicationDetailsDrawer";
import ScholarshipCardSkeleton from "@/components/ScholarshipCardSkeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/useToast";
import Toast from "@/components/Toast";
import {
	formatDate,
	formatTime,
	formatAmountPerScholar,
} from "@/utils/formatting.utils";
import { useMyApplications } from "@/hooks/queries/useMyApplications";
import { useAuth } from "@/auth";
import type { Student } from "@/lib/student/model";
import {
	getApplicationsQueryParam,
	ScholarshipApplicationStatus,
	type Application,
} from "@/lib/scholarship/model";
import { getSponsorName } from "@/lib/sponsor/api";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { getMyApplicationsQuery } from "@/lib/scholarship/api";
import z from "zod";

enum FilterType {
	Applied = "applied",
	Past = "past",
	Granted = "granted",
}

const searchSchema = z.object({
	status: z.enum(FilterType).default(FilterType.Applied),
});

export const Route = createFileRoute("/_student/home")({
	component: Home,
	validateSearch: searchSchema,
});

function Home(): JSX.Element {
	usePageTitle("Home");

	const navigate = useNavigate();
	const [selectedApplication, setSelectedApplication] =
		useState<Application | null>(null);
	const { toast, showError } = useToast();
	const search = useSearch({ from: "/_student/home" });
	const auth = useAuth<Student>();

	function getEquivalentStatus(filter: FilterType): string {
		if (filter === FilterType.Applied) {
			return `${ScholarshipApplicationStatus.Pending},${ScholarshipApplicationStatus.Approved}`;
		}

		if (filter === FilterType.Past) {
			return `${ScholarshipApplicationStatus.Approved},${ScholarshipApplicationStatus.Denied}`;
		}

		return ScholarshipApplicationStatus.Granted;
	}

	const applicationsQuery = useQuery(
		getMyApplicationsQuery({
			studentId: auth.profile.id,
			status: getEquivalentStatus(search.status),
		}),
	);

	const applications = applicationsQuery.data;

	useEffect(() => {
		if (applicationsQuery.isError) {
			showError("Error", applicationsQuery.error.message, 2500);
		}
	}, [applicationsQuery.isError]);

	const filters: { key: FilterType; label: string }[] = [
		{ key: FilterType.Applied, label: "Applied" },
		{ key: FilterType.Past, label: "Past" },
		{ key: FilterType.Granted, label: "Granted" },
	];

	if (applicationsQuery.isLoading) {
		return Array.from({ length: 4 }).map((_, index) => (
			<div key={`skeleton-${index}`} className="flex gap-4 md:gap-6">
				{/* Desktop: Date/Time */}
				<div className="hidden md:flex gap-4">
					<div className="flex flex-col items-start w-30 flex-shrink-0 pt-1">
						<div className="text-left space-y-1">
							<Skeleton className="h-4 w-30 bg-muted-foreground" />
							<Skeleton className="h-3 w-20 bg-muted-foreground" />
						</div>
					</div>

					{/* Timeline dot and line */}
					<div className="relative flex flex-col items-center pt-1">
						<div className="w-3 h-3 rounded-full mr-[1px] bg-[#3A52A6] shadow-[0_0_0_4px_rgba(63,81,181,0.22)] z-10" />
						<div
							className={`w-px flex-1 border-l border-dashed border-[#3A52A6]/60 ${
								index === 3 ? "opacity-70" : ""
							}`}
						/>
					</div>
				</div>

				{/* Mobile/Tablet */}
				<div className="md:hidden relative flex flex-col items-center pt-1">
					<div className="w-3 h-3 rounded-full bg-[#3A52A6] shadow-[0_0_0_4px_rgba(63,81,181,0.22)] z-10" />
					<div
						className={`mt-1 w-px flex-1 border-l border-dashed border-[#3A52A6]/60 ${
							index === 3 ? "opacity-70" : ""
						}`}
					/>
				</div>

				{/* Card column */}
				<div className="flex-1 mb-3">
					{/* Mobile/Tablet: Date/Time */}
					<div className="md:hidden mb-2 text-left space-y-1">
						<Skeleton className="h-3 w-28 bg-muted-foreground" />
						<Skeleton className="h-[11px] w-16 bg-muted-foreground" />
					</div>

					<ScholarshipCardSkeleton index={index} />
				</div>
			</div>
		));
	}

	if (!applications || applications.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-16 text-center">
				<Files className="w-24 md:w-30 h-24 md:h-30 text-[#D1D5DB]" />
				<h2 className="text-lg md:text-xl text-[#9CA3AF] mt-8 mb-2">
					No applications yet
				</h2>
				<p className="max-w-md text-sm md:text-base text-[#9CA3AF] mb-4 md:mb-8">
					You have to apply for scholarships to see them listed here.
				</p>
				<button
					onClick={() => navigate({ to: "/discover" })}
					className="inline-flex cursor-pointer items-center gap-2 px-4 py-2.5 bg-[#9CA3AF] text-tertiary text-sm md:text-base rounded-md hover:bg-muted-foreground hover:text-tertiary text-tertiary transition-colors"
				>
					Explore Scholarships
					<ArrowRight size={18} />
				</button>
			</div>
		);
	}

	return (
		<div className="min-h-screen">
			{toast && <Toast {...toast} />}

			<div className="max-w-176 mx-auto space-y-12">
				{/* Header */}
				<div className="flex items-center justify-between gap-4">
					<div>
						<h1 className="text-2xl md:text-3xl text-primary">Applications</h1>
					</div>

					<div className="flex items-center gap-3 relative rounded-md bg-[#3A52A6] p-0.75 shadow-sm border border-[#4F63C4]">
						{filters.map((filter) => {
							return (
								<Link
									to="/home"
									search={{ status: filter.key }}
									key={filter.key}
									type="button"
									className="relative px-3 md:px-4 py-1.5 rounded-sm transition-all text-[#E5E7EB]/80 hover:text-tertiary text-xs md:text-sm"
									activeProps={{
										className: "bg-[#607EF2] text-tertiary shadow-md",
									}}
								>
									<span>{filter.label}</span>
								</Link>
							);
						})}
					</div>
				</div>

				{/* List / States */}
				<div>
					<div>
						{applications.map((item, index) => (
							<div key={item.application.id} className="flex gap-4 md:gap-6">
								{/* Desktop: Date/Time */}
								<div className="hidden md:flex gap-4">
									<div className="flex flex-col items-start w-30 flex-shrink-0 pt-1">
										<div className="text-left">
											<div className="text-sm text-primary">
												{formatDate(item.application.createdAt)}
											</div>
											<div className="text-xs text-[#6B7280]">
												{formatDate(item.application.createdAt)}
											</div>
										</div>
									</div>

									{/* Timeline dot and line */}
									<div className="relative flex flex-col items-center pt-1">
										<div className="w-3 h-3 rounded-full mr-[1px] bg-[#3A52A6] shadow-[0_0_0_4px_rgba(63,81,181,0.22)] z-10" />
										<div
											className={`w-px flex-1 border-l border-dashed border-[#3A52A6]/60 ${
												index === applications.length - 1 ? "opacity-70" : ""
											}`}
										/>
									</div>
								</div>

								{/* Mobile/Tablet */}
								<div className="md:hidden relative flex flex-col items-center pt-1">
									<div className="w-3 h-3 rounded-full bg-[#3A52A6] shadow-[0_0_0_4px_rgba(63,81,181,0.22)] z-10" />
									<div
										className={`mt-1 w-px flex-1 border-l border-dashed border-[#3A52A6]/60 ${
											index === applications.length - 1 ? "opacity-70" : ""
										}`}
									/>
								</div>

								{/* Card column */}
								<div className="flex-1 mb-3">
									{/* Mobile/Tablet: Date/Time */}
									<div className="md:hidden mb-2 text-left">
										<div className="text-xs text-primary">
											{formatDate(item.application.createdAt)}
										</div>
										<div className="text-[11px] text-[#6B7280]">
											{formatTime(item.application.createdAt)}
										</div>
									</div>

									<button
										type="button"
										onClick={() => setSelectedApplication(item)}
										className="w-full text-left"
									>
										<motion.div
											initial={{ opacity: 0, y: 18 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ duration: 0.3, delay: index * 0.05 }}
											whileHover={{
												scale: 0.99,
												transition: { duration: 0.2 },
											}}
											className="overflow-hidden rounded-lg bg-white hover:border-[#3A52A6] shadow-sm border border-[#E0ECFF] hover:shadow-md transition-shadow cursor-pointer transition-colors"
										>
											{/* Header */}
											<div className="flex bg-[#3A52A6]">
												<div className="relative w-32 h-32 flex-shrink-0 bg-[#1D2A5B]">
													<img
														src={item.scholarship.imageUrl || ""}
														alt={item.scholarship.name}
														className="h-full w-full object-cover"
													/>
												</div>

												<div className="flex-1 px-3 py-2 text-[#F9FAFB]">
													<div className="flex items-start justify-between gap-2">
														<div className="space-y-1 flex-1 min-w-0">
															<h3 className="text-lg md:text-xl line-clamp-1 pr-2">
																{item.scholarship.name}
															</h3>

															<div className="flex gap-1 mb-3">
																<span className="px-2 py-0.5 bg-white/90 text-secondary text-[10px] md:text-[11px] rounded whitespace-nowrap">
																	{item.scholarship.scholarshipType.name}
																</span>
																<span className="px-2 py-0.5 bg-white/90 text-secondary text-[10px] md:text-[11px] rounded whitespace-nowrap">
																	{item.scholarship.purpose.name}
																</span>
															</div>

															<div className="space-y-1.5 text-xs">
																<div className="flex items-center gap-2">
																	<div className="w-4 h-4 rounded-full bg-card flex items-center justify-center flex-shrink-0">
																		{item.scholarship?.sponsor?.avatarUrl ? (
																			<img
																				src={
																					item.scholarship?.sponsor?.avatarUrl
																				}
																				alt={getSponsorName(
																					item.scholarship.sponsor,
																				)}
																				className="w-full h-full rounded-full object-cover"
																			/>
																		) : (
																			<UserIcon className="w-full h-full text-secondary" />
																		)}
																	</div>
																	<span className="truncate">
																		{getSponsorName(item.scholarship.sponsor)}
																	</span>
																</div>
																<div className="flex items-center gap-2">
																	<Calendar
																		size={16}
																		className="flex-shrink-0"
																	/>
																	<span className="truncate">
																		{format(
																			item.scholarship.applicationDeadline,
																			"MMM. d, yyyy",
																		)}
																	</span>
																</div>
															</div>
														</div>

														<div className="flex flex-col items-end gap-1 mt-1 flex-shrink-0">
															<div
																className={`${
																	{
																		pending: "text-[#FCD34D]",
																		shortlisted: "text-[#FDBA74]",
																		approved: "text-[#6EE7B7]",
																		denied: "text-[#EF4444]",
																		granted: "text-[#C7D2FE]",
																	}[item.application.status.code]
																}`}
																title={
																	statusStyles[item.application.status.code]
																		.label
																}
															>
																{(() => {
																	const statusIcons = {
																		pending: Clock,
																		shortlisted: FileText,
																		approved: CheckCircle,
																		denied: XCircle,
																		granted: Award,
																	};
																	const Icon =
																		statusIcons[item.application.status.code];
																	return <Icon size={20} />;
																})()}
															</div>
														</div>
													</div>
												</div>
											</div>

											{/* Body */}
											<div className="space-y-4 bg-white px-4 py-3 md:px-5 md:py-4">
												<div className="grid grid-cols-2 gap-2 md:gap-3">
													<div className="rounded-xl border border-border bg-[#F9FAFB] p-3">
														<div className="mb-1 flex items-center gap-1.5 text-[11px] text-[#6B7280]">
															<Coins className="h-3.5 w-3.5" />
															<span>Amount</span>
														</div>
														<p className="text-sm text-primary">
															{formatAmountPerScholar(
																item.scholarship.totalAmount,
																item.scholarship.totalSlots,
																{ locale: "en-PH" },
															)}
														</p>
														<p className="text-[11px] text-[#6B7280]">
															per scholar
														</p>
													</div>

													<div className="rounded-xl border border-border bg-[#F9FAFB] p-3">
														<div className="mb-1 flex items-center gap-1.5 text-[11px] text-[#6B7280]">
															<Users className="h-3.5 w-3.5" />
															<span>Slots</span>
														</div>
														<p className="text-sm text-primary">
															{item.scholarship.totalSlots}
														</p>
														<p className="text-[11px] text-[#6B7280]">
															scholars
														</p>
													</div>
												</div>

												<div className="grid grid-cols-2 gap-4 md:gap-6">
													<div>
														<h4 className="mb-1.5 text-xs tracking-wide text-[#6B7280]">
															Criteria
														</h4>
														<div className="flex flex-wrap gap-1.5">
															{item.scholarship.criterias
																.slice(0, 2)
																.map((item, i) => (
																	<span
																		key={i}
																		className="px-2.5 py-1 bg-[#F9FAFB] text-[#374151] text-[10px] md:text-[11px] rounded border border-border"
																	>
																		{item}
																	</span>
																))}
															{item.scholarship.criterias.length > 2 && (
																<span className="px-2.5 py-1 bg-[#F9FAFB] text-[#374151] text-[10px] md:text-[11px] rounded border border-border">
																	+ {item.scholarship.criterias.length - 2} more
																</span>
															)}
														</div>
													</div>

													<div>
														<h4 className="mb-1.5 text-xs tracking-wide text-[#6B7280]">
															Required Documents
														</h4>
														<div className="flex flex-wrap gap-1.5">
															{item.scholarship.requirements
																.slice(0, 2)
																.map((item, i) => (
																	<span
																		key={i}
																		className="px-2.5 py-1 bg-[#F9FAFB] text-[#374151] text-[10px] md:text-[11px] rounded border border-border"
																	>
																		{item}
																	</span>
																))}
															{item.scholarship.requirements.length > 2 && (
																<span className="px-2.5 py-1 bg-[#F9FAFB] text-[#374151] text-[10px] md:text-[11px] rounded border border-border">
																	+ {item.scholarship.requirements.length - 2}{" "}
																	more
																</span>
															)}
														</div>
													</div>
												</div>
											</div>
										</motion.div>
									</button>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>

			<AnimatePresence>
				{selectedApplication && (
					<ApplicationDetailsModal
						application={selectedApplication}
						onClose={() => setSelectedApplication(null)}
					/>
				)}
			</AnimatePresence>
		</div>
	);
}
